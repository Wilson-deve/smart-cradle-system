<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        // Define role priorities (higher number = higher priority)
        $rolePriorities = [
            'admin' => 3,
            'parent' => 2,
            'babysitter' => 1,
        ];

        // Get all users with multiple roles
        $usersWithMultipleRoles = DB::table('role_user')
            ->select('user_id')
            ->groupBy('user_id')
            ->havingRaw('COUNT(*) > 1')
            ->get();

        foreach ($usersWithMultipleRoles as $user) {
            // Get all roles for this user
            $userRoles = DB::table('role_user')
                ->join('roles', 'roles.id', '=', 'role_user.role_id')
                ->where('user_id', $user->user_id)
                ->get();

            // Find the highest priority role
            $highestPriorityRole = null;
            $highestPriority = -1;

            foreach ($userRoles as $role) {
                $priority = $rolePriorities[$role->slug] ?? 0;
                if ($priority > $highestPriority) {
                    $highestPriority = $priority;
                    $highestPriorityRole = $role;
                }
            }

            if ($highestPriorityRole) {
                // Delete all roles for this user
                DB::table('role_user')
                    ->where('user_id', $user->user_id)
                    ->delete();

                // Assign only the highest priority role
                DB::table('role_user')->insert([
                    'user_id' => $user->user_id,
                    'role_id' => $highestPriorityRole->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    public function down()
    {
        // This migration cannot be reversed as it modifies existing data
    }
}; 