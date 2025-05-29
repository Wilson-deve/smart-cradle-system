<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Models\Device;
use App\Models\Notification;
use App\Models\SystemLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;
use App\Models\Alert;

class MonitoringController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display the monitoring dashboard.
     */
    public function index()
    {
        $this->authorize('view', 'monitoring');
        
        $devices = Device::with(['users', 'logs', 'alerts'])
            ->orderBy('last_activity_at', 'desc')
            ->get();
        
        return Inertia::render('Admin/Monitoring', [
            'devices' => $devices,
        ]);
    }

    /**
     * Get real-time data for a device.
     */
    public function getDeviceData(Device $device)
    {
        $this->authorize('view', 'monitoring');
        $this->authorize('monitor', $device);
        
        // Get real-time sensor data
        $sensorData = [
            'temperature' => $this->getTemperature($device),
            'humidity' => $this->getHumidity($device),
            'noise_level' => $this->getNoiseLevel($device),
            'movement' => $this->getMovement($device),
            'wetness' => $this->getWetness($device),
            'light_level' => $this->getLightLevel($device),
            'battery_level' => $this->getBatteryLevel($device),
            'last_updated' => now()->toIso8601String(),
        ];

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
            'swing_time' => $this->calculateSwingTime($device),
            'music_playtime' => $this->calculateMusicPlaytime($device),
            'projector_usage' => $this->calculateProjectorUsage($device),
        ];

        // Get latest sensor readings from database
        $latestReadings = $device->sensorReadings()
            ->latest()
            ->first();

        // Combine real-time and stored data
        return response()->json([
            'sensor_data' => $sensorData,
            'device_status' => $deviceStatus,
            'recent_alerts' => $recentAlerts,
            'usage_stats' => $usageStats,
            'stored_readings' => $latestReadings ? [
                'temperature' => $latestReadings->temperature,
                'humidity' => $latestReadings->humidity,
                'noise_level' => $latestReadings->noise_level,
                'light_level' => $latestReadings->light_level,
                'movement_detected' => $latestReadings->movement_detected,
                'wetness_detected' => $latestReadings->wetness_detected,
                'timestamp' => $latestReadings->created_at->toIso8601String(),
            ] : null,
        ]);
    }

    /**
     * Get camera feed for a device.
     */
    public function getCameraFeed(Device $device)
    {
        $this->authorize('view', 'monitoring');
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

    /**
     * Get health analytics for a device.
     */
    public function getHealthAnalytics(Device $device)
    {
        $this->authorize('viewHealth', $device);
        
        // Get device health metrics
        $healthMetrics = [
            'uptime' => $this->calculateUptime($device),
            'battery_health' => $this->calculateBatteryHealth($device),
            'sensor_health' => $this->checkSensorHealth($device),
            'network_health' => $this->checkNetworkHealth($device),
            'maintenance_needed' => $this->checkMaintenanceNeeded($device),
        ];

        // Get historical data
        $historicalData = [
            'temperature_history' => $this->getTemperatureHistory($device),
            'humidity_history' => $this->getHumidityHistory($device),
            'noise_history' => $this->getNoiseHistory($device),
        ];

        return response()->json([
            'health_metrics' => $healthMetrics,
            'historical_data' => $historicalData,
        ]);
    }

    /**
     * Get alerts for a device.
     */
    public function getAlerts(Device $device = null)
    {
        $this->authorize('alerts', 'monitoring');
        
        $user = Auth::user();
        
        if ($device) {
            $this->authorize('view', $device);
            
            $alerts = Alert::where('device_id', $device->id)
                ->orderBy('created_at', 'desc')
                ->get();
        } else {
            // If no device is specified, show all alerts for devices the user has access to
            $deviceIds = $user->devices()->pluck('devices.id');
            
            $alerts = Alert::whereIn('device_id', $deviceIds)
                ->orderBy('created_at', 'desc')
                ->get();
        }
        
        return response()->json($alerts);
    }

    /**
     * Mark an alert as read.
     */
    public function markAlertAsRead(Alert $alert)
    {
        $this->authorize('updateAlerts', 'monitoring');
        
        $alert->markAsRead();
        
        return response()->json([
            'success' => true,
            'message' => 'Alert marked as read.',
        ]);
    }

    /**
     * Mark all alerts as read.
     */
    public function markAllAlertsAsRead(Request $request)
    {
        $this->authorize('updateAlerts', 'monitoring');
        
        $user = Auth::user();
        
        $deviceIds = $user->devices()->pluck('devices.id');
        
        Alert::whereIn('device_id', $deviceIds)
            ->whereNull('read_at')
            ->update([
                'read_at' => now(),
            ]);
        
        return response()->json([
            'success' => true,
            'message' => 'All alerts marked as read.',
        ]);
    }

    /**
     * Get system logs.
     */
    public function getSystemLogs(Request $request)
    {
        $this->authorize('view', 'monitoring');
        
        $query = SystemLog::query();
        
        // Add any filters here
        
        $logs = $query->orderBy('created_at', 'desc')->get();
        
        return response()->json($logs);
    }

    // Helper methods for data collection
    private function getTemperature(Device $device): float
    {
        // Implement actual temperature reading logic
        return rand(35, 38) + (rand(0, 10) / 10);
    }

    private function getHumidity(Device $device): int
    {
        // Implement actual humidity reading logic
        return rand(40, 60);
    }

    private function getNoiseLevel(Device $device): int
    {
        // Implement actual noise level reading logic
        return rand(0, 100);
    }

    private function getMovement(Device $device): bool
    {
        // Implement actual movement detection logic
        return rand(0, 1) === 1;
    }

    private function getWetness(Device $device): bool
    {
        // Implement actual wetness detection logic
        return rand(0, 1) === 1;
    }

    private function getLightLevel(Device $device): int
    {
        // Implement actual light level reading logic
        return rand(0, 100);
    }

    private function getBatteryLevel(Device $device): int
    {
        // Implement actual battery level reading logic
        return rand(20, 100);
    }

    private function calculateSwingTime(Device $device): int
    {
        // Calculate total swing time in minutes for the last 24 hours
        return $device->logs()
            ->where('action', 'swing_control')
            ->where('created_at', '>=', now()->subHours(24))
            ->sum('duration');
    }

    private function calculateMusicPlaytime(Device $device): int
    {
        // Calculate total music playtime in minutes for the last 24 hours
        return $device->logs()
            ->where('action', 'music_control')
            ->where('created_at', '>=', now()->subHours(24))
            ->sum('duration');
    }

    private function calculateProjectorUsage(Device $device): int
    {
        // Calculate total projector usage time in minutes for the last 24 hours
        return $device->logs()
            ->where('action', 'projector_control')
            ->where('created_at', '>=', now()->subHours(24))
            ->sum('duration');
    }

    private function calculateUptime(Device $device): float
    {
        // Calculate device uptime percentage for the last 7 days
        $totalTime = 7 * 24 * 60; // 7 days in minutes
        $onlineTime = $device->logs()
            ->where('action', 'status_change')
            ->where('created_at', '>=', now()->subDays(7))
            ->where('data->status', 'online')
            ->sum('duration');

        return ($onlineTime / $totalTime) * 100;
    }

    private function calculateBatteryHealth(Device $device): int
    {
        // Calculate battery health based on charge cycles and age
        $batteryAge = Carbon::parse($device->created_at)->diffInDays();
        $chargeCycles = $device->logs()
            ->where('action', 'battery_charge')
            ->count();
        
        // Battery health degrades with age and charge cycles
        // Assuming a 2-year lifespan and 1000 charge cycles
        $ageImpact = min(($batteryAge / (2 * 365)) * 20, 20); // Max 20% impact from age
        $cycleImpact = min(($chargeCycles / 1000) * 20, 20); // Max 20% impact from cycles
        
        return max(100 - $ageImpact - $cycleImpact, 0);
    }

    private function checkSensorHealth(Device $device): array
    {
        // Get the latest sensor readings
        $latestReadings = $device->sensorReadings()
            ->latest()
            ->first();

        // Check if sensors are reporting within expected ranges
        $temperatureOk = $latestReadings && $latestReadings->temperature >= 15 && $latestReadings->temperature <= 35;
        $humidityOk = $latestReadings && $latestReadings->humidity >= 30 && $latestReadings->humidity <= 70;
        $noiseOk = $latestReadings && $latestReadings->noise_level >= 0 && $latestReadings->noise_level <= 100;
        $movementOk = $latestReadings && $latestReadings->movement_detected !== null;
        $wetnessOk = $latestReadings && $latestReadings->wetness_detected !== null;

        return [
            'temperature' => $temperatureOk,
            'humidity' => $humidityOk,
            'noise' => $noiseOk,
            'movement' => $movementOk,
            'wetness' => $wetnessOk,
            'last_reading' => $latestReadings ? $latestReadings->created_at->toIso8601String() : null,
        ];
    }

    private function checkNetworkHealth(Device $device): array
    {
        // Get the latest network status
        $latestStatus = $device->logs()
            ->where('action', 'network_status')
            ->latest()
            ->first();

        // Check current connection status
        $connected = $device->status === 'online';
        $signalStrength = $device->signal_strength ?? 0;

        // Calculate packet loss and latency from logs
        $recentLogs = $device->logs()
            ->where('action', 'network_status')
            ->where('created_at', '>=', now()->subMinutes(5))
            ->get();

        $totalPackets = $recentLogs->count();
        $lostPackets = $recentLogs->where('data->packet_lost', true)->count();
        $averageLatency = $recentLogs->avg('data->latency') ?? 0;

        $packetLoss = $totalPackets > 0 ? ($lostPackets / $totalPackets) * 100 : 0;

        return [
            'connected' => $connected,
            'signal_strength' => $signalStrength,
            'latency' => round($averageLatency, 2),
            'packet_loss' => round($packetLoss, 2),
            'last_check' => $latestStatus ? $latestStatus->created_at->toIso8601String() : null,
        ];
    }

    private function checkMaintenanceNeeded(Device $device): array
    {
        $lastMaintenance = $device->last_maintenance_at;
        $nextMaintenance = $device->next_maintenance_at;
        $batteryHealth = $this->calculateBatteryHealth($device);
        $sensorHealth = $this->checkSensorHealth($device);

        // Check if maintenance is needed based on various factors
        $maintenanceNeeded = [
            'battery_replacement' => $batteryHealth < 20,
            'sensor_calibration' => array_filter($sensorHealth, fn($status) => !$status && $status !== null),
            'firmware_update' => $device->firmware_version !== config('device.latest_firmware_version'),
            'cleaning_needed' => Carbon::parse($lastMaintenance)->diffInDays() > 30,
            'next_maintenance' => $nextMaintenance ? Carbon::parse($nextMaintenance)->toIso8601String() : null,
            'days_until_maintenance' => $nextMaintenance ? Carbon::parse($nextMaintenance)->diffInDays(now()) : null,
        ];

        return $maintenanceNeeded;
    }

    private function getTemperatureHistory(Device $device): array
    {
        // Get temperature history for the last 24 hours
        return $device->logs()
            ->where('action', 'temperature_reading')
            ->where('created_at', '>=', now()->subHours(24))
            ->orderBy('created_at')
            ->pluck('data->temperature', 'created_at')
            ->toArray();
    }

    private function getHumidityHistory(Device $device): array
    {
        // Get humidity history for the last 24 hours
        return $device->logs()
            ->where('action', 'humidity_reading')
            ->where('created_at', '>=', now()->subHours(24))
            ->orderBy('created_at')
            ->pluck('data->humidity', 'created_at')
            ->toArray();
    }

    private function getNoiseHistory(Device $device): array
    {
        // Get noise level history for the last 24 hours
        return $device->logs()
            ->where('action', 'noise_reading')
            ->where('created_at', '>=', now()->subHours(24))
            ->orderBy('created_at')
            ->pluck('data->noise_level', 'created_at')
            ->toArray();
    }
} 