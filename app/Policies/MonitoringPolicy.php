<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class MonitoringPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view the monitoring dashboard.
     */
    public function view(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasPermission('monitoring.view');
    }

    /**
     * Determine whether the user can control monitoring features.
     */
    public function control(User $user): bool
    {
        return $user->hasPermission('monitoring.control');
    }

    /**
     * Determine whether the user can view and manage alerts.
     */
    public function alerts(User $user): bool
    {
        return $user->hasPermission('monitoring.alerts');
    }
} 