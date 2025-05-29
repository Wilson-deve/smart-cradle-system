<?php

namespace App\Services;

use App\Models\Device;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DeviceService
{
    /**
     * Register a new device
     */
    public function registerDevice(array $data, User $user): Device
    {
        // Check if the user is a parent and already has a device
        if ($user->hasRole('parent') && $user->devices()->count() > 0) {
            throw new \Exception('Parent users can only have one device.');
        }

        return DB::transaction(function () use ($data, $user) {
            $device = Device::create([
                'name' => $data['name'],
                'serial_number' => $data['serial_number'],
                'mac_address' => $data['mac_address'],
                'firmware_version' => $data['firmware_version'] ?? '1.0.0',
                'status' => 'offline',
                'last_activity_at' => now(),
            ]);

            // Assign the user as the device owner
            $device->users()->attach($user->id, [
                'relationship_type' => 'owner',
                'permissions' => json_encode(['view', 'control', 'manage']),
            ]);

            Log::info('Device registered', [
                'device_id' => $device->id,
                'user_id' => $user->id,
            ]);

            return $device;
        });
    }

    /**
     * Update device information
     */
    public function updateDevice(Device $device, array $data): Device
    {
        $device->update($data);
        
        Log::info('Device updated', [
            'device_id' => $device->id,
            'changes' => $data,
        ]);

        return $device;
    }

    /**
     * Assign a user to a device
     */
    public function assignUser(Device $device, User $user, string $relationshipType, array $permissions): void
    {
        // Check if the user is a parent and already has a device
        if ($user->hasRole('parent') && $relationshipType === 'owner') {
            $existingDevice = $user->devices()
                ->where('devices.id', '!=', $device->id)
                ->first();
                
            if ($existingDevice) {
                throw new \Exception('Parent users can only have one device.');
            }
        }

        DB::transaction(function () use ($device, $user, $relationshipType, $permissions) {
            $device->users()->attach($user->id, [
                'relationship_type' => $relationshipType,
                'permissions' => json_encode($permissions),
            ]);

            Log::info('User assigned to device', [
                'device_id' => $device->id,
                'user_id' => $user->id,
                'relationship_type' => $relationshipType,
            ]);
        });
    }

    /**
     * Remove a user from a device
     */
    public function removeUser(Device $device, User $user): void
    {
        DB::transaction(function () use ($device, $user) {
            $device->users()->detach($user->id);

            Log::info('User removed from device', [
                'device_id' => $device->id,
                'user_id' => $user->id,
            ]);
        });
    }

    /**
     * Update device status
     */
    public function updateStatus(Device $device, string $status): Device
    {
        $device->update([
            'status' => $status,
            'last_activity_at' => now(),
        ]);

        Log::info('Device status updated', [
            'device_id' => $device->id,
            'status' => $status,
        ]);

        return $device;
    }

    /**
     * Get device health metrics
     */
    public function getHealthMetrics(Device $device): array
    {
        return [
            'status' => [
                'current' => $device->getHealthStatus(),
                'online' => $device->isOnline(),
                'needs_maintenance' => $device->needsMaintenance(),
            ],
            'battery' => [
                'level' => $device->battery_level,
                'status' => $device->getBatteryStatus(),
            ],
            'network' => [
                'strength' => $device->signal_strength,
                'status' => $device->getNetworkStatus(),
            ],
            'sensors' => $device->getSensorReadings(),
            'maintenance' => [
                'last_maintenance' => $device->last_maintenance_at,
                'next_maintenance' => $device->next_maintenance_at,
                'history' => $device->getMaintenanceHistory(),
            ],
            'alerts' => $device->getRecentAlerts(),
            'usage' => $device->getUsageStatistics(),
        ];
    }

    /**
     * Get device usage statistics
     */
    public function getUsageStatistics(Device $device): array
    {
        return [
            'swing_time' => $device->swing_time,
            'music_playtime' => $device->music_playtime,
            'projector_usage' => $device->projector_usage,
            'camera_usage' => $device->camera_usage,
        ];
    }

    /**
     * Get device sensor data
     */
    public function getSensorData(Device $device): array
    {
        return [
            'temperature' => $device->temperature,
            'humidity' => $device->humidity,
            'noise_level' => $device->noise_level,
            'light_level' => $device->light_level,
            'movement_detected' => $device->movement_detected,
            'wetness_detected' => $device->wetness_detected,
        ];
    }
} 