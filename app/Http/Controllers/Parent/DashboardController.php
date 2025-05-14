<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Models\Device;
use App\Models\User;
use App\Models\Alert;
use App\Models\SensorReading;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Get user's devices with their latest sensor readings
        $devices = $user->devices()->with(['sensorReadings' => function ($query) {
            $query->latest()->take(5);
        }])->get();

        // Get assigned babysitters
        $babysitters = $user->babysitters()->get();

        // Get recent alerts
        $alerts = $user->alerts()
            ->where('created_at', '>=', now()->subDays(7))
            ->orderBy('created_at', 'desc')
            ->get();

        // Calculate health metrics
        $healthMetrics = $this->calculateHealthMetrics($user);

        return Inertia::render('Parent/Dashboard', [
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
            'babysitters' => $babysitters->map(function ($babysitter) {
                return [
                    'id' => $babysitter->id,
                    'name' => $babysitter->name,
                    'email' => $babysitter->email,
                    'status' => $babysitter->pivot->status,
                    'last_active' => $babysitter->last_active_at?->diffForHumans() ?? 'Never',
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

    public function addBabysitter(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $babysitter = User::where('email', $request->email)->first();
        
        // Check if the user is already assigned as a babysitter
        if ($request->user()->babysitters()->where('user_id', $babysitter->id)->exists()) {
            return back()->with('error', 'This user is already assigned as a babysitter.');
        }

        // Assign the babysitter
        $request->user()->babysitters()->attach($babysitter->id, [
            'status' => 'active',
        ]);

        return back()->with('success', 'Babysitter added successfully.');
    }

    public function removeBabysitter(Request $request, User $babysitter)
    {
        $request->user()->babysitters()->detach($babysitter->id);

        return back()->with('success', 'Babysitter removed successfully.');
    }

    private function calculateHealthMetrics(User $user)
    {
        $devices = $user->devices;
        
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