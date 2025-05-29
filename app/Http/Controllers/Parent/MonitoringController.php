<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Models\Device;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Services\DeviceService;

class MonitoringController extends Controller
{
    protected $deviceService;

    public function __construct(DeviceService $deviceService)
    {
        $this->deviceService = $deviceService;
    }

    public function index()
    {
        $user = Auth::user();
        
        // Get devices associated with the parent through the pivot table
        $devices = $user->devices()
            ->with(['logs', 'alerts'])
            ->orderBy('last_activity_at', 'desc')
            ->get();
        
        return Inertia::render('Parent/Monitoring', [
            'devices' => $devices,
        ]);
    }

    public function show(Device $device)
    {
        $this->authorize('monitor', $device);
        
        return Inertia::render('Parent/Monitoring/Show', [
            'device' => $device,
        ]);
    }

    public function getDeviceData(Device $device)
    {
        $this->authorize('monitor', $device);
        
        // Get latest sensor readings
        $latestReadings = $device->sensorReadings()
            ->latest()
            ->first();

        // Get device status and settings
        $deviceStatus = [
            'status' => $device->status,
            'last_activity_at' => $device->last_activity_at,
            'swing_status' => $device->settings['swing']['enabled'] ?? false,
            'music_status' => $device->settings['music']['enabled'] ?? false,
            'projector_status' => $device->settings['projector']['enabled'] ?? false,
        ];

        // Get recent alerts
        $recentAlerts = $device->alerts()
            ->where('created_at', '>=', now()->subHours(24))
            ->orderBy('created_at', 'desc')
            ->get();

        // Get usage statistics
        $usageStats = [
            'swing_time' => $device->logs()
                ->where('action', 'swing_control')
                ->where('created_at', '>=', now()->subHours(24))
                ->sum('duration'),
            'music_playtime' => $device->logs()
                ->where('action', 'music_control')
                ->where('created_at', '>=', now()->subHours(24))
                ->sum('duration'),
            'projector_usage' => $device->logs()
                ->where('action', 'projector_control')
                ->where('created_at', '>=', now()->subHours(24))
                ->sum('duration'),
        ];

        return response()->json([
            'sensor_data' => $latestReadings ? [
                'temperature' => $latestReadings->temperature,
                'humidity' => $latestReadings->humidity,
                'noise_level' => $latestReadings->noise_level,
                'movement_detected' => $latestReadings->movement_detected,
                'wetness_detected' => $latestReadings->wetness_detected,
                'timestamp' => $latestReadings->created_at->toIso8601String(),
            ] : null,
            'device_status' => $deviceStatus,
            'recent_alerts' => $recentAlerts,
            'usage_stats' => $usageStats,
        ]);
    }

    public function getCameraFeed(Device $device)
    {
        $this->authorize('monitor', $device);
        
        // Get camera feed URL and status
        $cameraData = [
            'stream_url' => $device->settings['camera']['stream_url'] ?? null,
            'status' => $device->settings['camera']['status'] ?? 'offline',
            'last_frame' => $device->settings['camera']['last_frame'] ?? null,
            'night_vision' => $device->settings['camera']['night_vision'] ?? false,
        ];
        
        return response()->json($cameraData);
    }
} 