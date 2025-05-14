<?php

namespace App\Policies;

use App\Models\Alert;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class AlertPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any alerts.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('view_alerts') || $user->hasPermission('manage_alerts');
    }

    /**
     * Determine whether the user can view the alert.
     */
    public function view(User $user, Alert $alert): bool
    {
        return $user->hasPermission('view_alerts') || $user->hasPermission('manage_alerts');
    }

    /**
     * Determine whether the user can update the alert.
     */
    public function update(User $user, Alert $alert): bool
    {
        return $user->hasPermission('manage_alerts');
    }

    /**
     * Determine whether the user can delete the alert.
     */
    public function delete(User $user, Alert $alert): bool
    {
        return $user->hasPermission('manage_alerts');
    }
} 