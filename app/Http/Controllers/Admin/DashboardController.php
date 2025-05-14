<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Device;
use App\Models\Alert;
use App\Models\SensorReading;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // Get system statistics
        $stats = [
            'total_users' => User::count(),
            'total_devices' => Device::count(),
            'active_devices' => Device::where('status', 'active')->count(),
            'total_alerts' => Alert::where('created_at', '>=', now()->subDay())->count(),
        ];

        // Get recent alerts
        $recentAlerts = Alert::with('device')
            ->where('created_at', '>=', now()->subDay())
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // Get device health overview
        $deviceHealth = $this->getDeviceHealthOverview();

        // Get user activity
        $userActivity = User::with('roles')
            ->where('last_active_at', '>=', now()->subDay())
            ->orderBy('last_active_at', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recent_alerts' => $recentAlerts->map(function ($alert) {
                return [
                    'id' => $alert->id,
                    'type' => $alert->type,
                    'message' => $alert->message,
                    'severity' => $alert->severity,
                    'device' => $alert->device?->name,
                    'created_at' => $alert->created_at->diffForHumans(),
                ];
            }),
            'device_health' => $deviceHealth,
            'user_activity' => $userActivity->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->roles->first()?->name,
                    'last_active' => $user->last_active_at?->diffForHumans(),
                ];
            }),
        ]);
    }

    private function getDeviceHealthOverview()
    {
        $devices = Device::with(['sensorReadings' => function ($query) {
            $query->where('created_at', '>=', now()->subDay());
        }])->get();

        return $devices->map(function ($device) {
            $readings = $device->sensorReadings;
            
            return [
                'id' => $device->id,
                'name' => $device->name,
                'status' => $device->status,
                'temperature' => [
                    'current' => $readings->last()?->temperature ?? 0,
                    'average' => round($readings->avg('temperature') ?? 0, 1),
                ],
                'humidity' => [
                    'current' => $readings->last()?->humidity ?? 0,
                    'average' => round($readings->avg('humidity') ?? 0, 1),
                ],
                'last_reading' => $readings->last()?->created_at?->diffForHumans() ?? 'No readings',
            ];
        });
    }
} 