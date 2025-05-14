<?php

namespace App\Http\Controllers\Babysitter;

use App\Http\Controllers\Controller;
use App\Models\Device;
use App\Models\Alert;
use App\Models\SensorReading;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Get assigned devices with their latest sensor readings
        $devices = $user->assignedDevices()->with(['sensorReadings' => function ($query) {
            $query->latest()->take(5);
        }])->get();

        // Get recent alerts for assigned devices
        $alerts = Alert::whereIn('device_id', $devices->pluck('id'))
            ->where('created_at', '>=', now()->subDay())
            ->orderBy('created_at', 'desc')
            ->get();

        // Get health metrics for assigned devices
        $healthMetrics = $this->calculateHealthMetrics($devices);

        return Inertia::render('Babysitter/Dashboard', [
            'devices' => $devices->map(function ($device) {
                return [
                    'id' => $device->id,
                    'name' => $device->name,
                    'status' => $device->status,
                    'last_reading' => [
                        'temperature' => $device->sensorReadings->first()?->temperature ?? 0,
                        'humidity' => $device->sensorReadings->first()?->humidity ?? 0,
                        'sound_level' => $device->sensorReadings->first()?->sound_level ?? 0,
                        'motion' => $device->sensorReadings->first()?->motion ?? false,
                    ],
                    'controls' => [
                        'swing' => $device->swing_enabled,
                        'lullaby' => $device->lullaby_enabled,
                    ],
                ];
            }),
            'alerts' => $alerts->map(function ($alert) {
                return [
                    'id' => $alert->id,
                    'type' => $alert->type,
                    'message' => $alert->message,
                    'severity' => $alert->severity,
                    'created_at' => $alert->created_at->diffForHumans(),
                ];
            }),
            'health_metrics' => $healthMetrics,
        ]);
    }

    public function toggleControl(Request $request, Device $device)
    {
        // Verify the babysitter has access to this device
        if (!$request->user()->assignedDevices()->where('devices.id', $device->id)->exists()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'control' => 'required|in:swing,lullaby',
            'enabled' => 'required|boolean',
        ]);

        $control = $request->input('control');
        $enabled = $request->input('enabled');

        // Update the device control
        $device->update([
            "{$control}_enabled" => $enabled,
        ]);

        return response()->json([
            'message' => ucfirst($control) . ' ' . ($enabled ? 'enabled' : 'disabled'),
        ]);
    }

    private function calculateHealthMetrics($devices)
    {
        // Get sensor readings for the last 24 hours
        $readings = SensorReading::whereIn('device_id', $devices->pluck('id'))
            ->where('created_at', '>=', now()->subDay())
            ->get();

        // Calculate averages
        $averageTemperature = $readings->avg('temperature') ?? 0;
        $averageHumidity = $readings->avg('humidity') ?? 0;

        // Count crying episodes (sound level above threshold)
        $cryingEpisodes = $readings->filter(function ($reading) {
            return $reading->sound_level > 80; // Threshold for crying
        })->count();

        // Get last crying episode
        $lastCryingEpisode = $readings->filter(function ($reading) {
            return $reading->sound_level > 80;
        })->sortByDesc('created_at')->first();

        return [
            'average_temperature' => round($averageTemperature, 1),
            'average_humidity' => round($averageHumidity, 1),
            'crying_episodes' => $cryingEpisodes,
            'last_crying_episode' => $lastCryingEpisode?->created_at->diffForHumans() ?? 'No crying episodes',
        ];
    }
} 