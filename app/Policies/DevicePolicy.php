<?php

namespace App\Policies;

use App\Models\Device;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class DevicePolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any devices.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasRole('parent');
    }

    /**
     * Determine whether the user can view the device.
     */
    public function view(User $user, Device $device): bool
    {
        return $user->hasDeviceAccess($device);
    }

    /**
     * Determine whether the user can create devices.
     */
    public function create(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasRole('parent');
    }

    /**
     * Determine whether the user can update the device.
     */
    public function update(User $user, Device $device): bool
    {
        return $user->hasRole('admin') || 
               $device->users()
                   ->where('user_id', $user->id)
                   ->whereIn('relationship_type', ['owner', 'caretaker'])
                   ->exists();
    }

    /**
     * Determine whether the user can delete the device.
     */
    public function delete(User $user, Device $device): bool
    {
        return $user->hasRole('admin') || 
               $device->users()
                   ->where('user_id', $user->id)
                   ->where('relationship_type', 'owner')
                   ->exists();
    }

    /**
     * Determine whether the user can manage device users.
     */
    public function manageUsers(User $user, Device $device): bool
    {
        return $user->hasRole('admin') || 
               $device->users()
                   ->where('user_id', $user->id)
                   ->where('relationship_type', 'owner')
                   ->exists();
    }

    /**
     * Determine whether the user can control the device.
     */
    public function control(User $user, Device $device): bool
    {
        if (!$user->hasDeviceAccess($device)) {
            return false;
        }

        $permissions = $user->getDevicePermissions($device);
        return in_array('control_device', $permissions);
    }

    /**
     * Determine whether the user can view device monitoring.
     */
    public function monitor(User $user, Device $device): bool
    {
        return $user->hasRole('admin') || 
               $device->users()
                   ->where('user_id', $user->id)
                   ->whereIn('relationship_type', ['owner', 'caretaker', 'viewer'])
                   ->exists();
    }

    /**
     * Determine whether the user can view health analytics.
     */
    public function viewHealth(User $user, Device $device): bool
    {
        if (!$user->hasDeviceAccess($device)) {
            return false;
        }

        $permissions = $user->getDevicePermissions($device);
        return in_array('view_health', $permissions);
    }

    /**
     * Determine whether the user can manage babysitter access.
     */
    public function manageBabysitters(User $user, Device $device): bool
    {
        if (!$user->hasDeviceAccess($device)) {
            return false;
        }

        $relationship = $user->devices()->where('device_id', $device->id)->first()->pivot;
        return $relationship->relationship_type === 'owner';
    }
} 