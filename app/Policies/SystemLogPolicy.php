<?php

namespace App\Policies;

use App\Models\SystemLog;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class SystemLogPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    public function view(User $user, SystemLog $systemLog): bool
    {
        return $user->isAdmin();
    }

    public function create(User $user): bool
    {
        return false; // Logs are created automatically by the system
    }

    public function update(User $user, SystemLog $systemLog): bool
    {
        return false; // Logs cannot be modified
    }

    public function delete(User $user, SystemLog $systemLog): bool
    {
        return false; // Logs cannot be deleted
    }
} 