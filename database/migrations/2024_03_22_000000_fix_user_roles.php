<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        // Remove the role column if it exists
        if (Schema::hasColumn('users', 'role')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('role');
            });
        }

        // Ensure role_user table exists
        if (!Schema::hasTable('role_user')) {
            Schema::create('role_user', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->foreignId('role_id')->constrained()->onDelete('cascade');
                $table->timestamps();
                
                $table->unique(['user_id', 'role_id']);
            });
        }

        // Get or create admin role
        $adminRole = DB::table('roles')->where('slug', 'admin')->first();
        if (!$adminRole) {
            $adminRole = DB::table('roles')->insertGetId([
                'name' => 'Administrator',
                'slug' => 'admin',
                'description' => 'System Administrator',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } else {
            $adminRole = $adminRole->id;
        }

        // Get admin users and ensure they have the admin role
        $adminUsers = DB::table('users')
            ->whereNotExists(function ($query) use ($adminRole) {
                $query->select(DB::raw(1))
                    ->from('role_user')
                    ->whereColumn('role_user.user_id', 'users.id')
                    ->where('role_user.role_id', $adminRole);
            })
            ->get();

        foreach ($adminUsers as $user) {
            DB::table('role_user')->insertOrIgnore([
                'user_id' => $user->id,
                'role_id' => $adminRole,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down()
    {
        // No need to revert as this is a fixing migration
    }
}; 