<?php

namespace App\Providers;

use App\Models\Device;
use App\Models\SystemLog;
use App\Models\User;
use App\Models\Alert;
use App\Policies\DevicePolicy;
use App\Policies\MonitoringPolicy;
use App\Policies\SystemLogPolicy;
use App\Policies\UserPolicy;
use App\Policies\AlertPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Device::class => DevicePolicy::class,
        SystemLog::class => SystemLogPolicy::class,
        User::class => UserPolicy::class,
        'monitoring' => MonitoringPolicy::class,
        Alert::class => AlertPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        // Define the manage-permissions gate
        Gate::define('manage-permissions', function ($user) {
            return $user->hasRole('admin') || $user->hasPermission('manage-permissions');
        });
    }
} 