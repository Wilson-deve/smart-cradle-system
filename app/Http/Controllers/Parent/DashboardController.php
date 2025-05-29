<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Models\Alert;
use App\Models\Activity;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        // Get devices through the many-to-many relationship
        $devices = $user->devices()
            ->with(['settings'])
            ->get();
            
        // Get alerts and activities for the user's devices
        $alerts = Alert::whereIn('device_id', $devices->pluck('id'))
            ->latest()
            ->take(5)
            ->get();
            
        $recent_activities = Activity::whereIn('device_id', $devices->pluck('id'))
            ->latest()
            ->take(10)
            ->get();

        return Inertia::render('Parent/Dashboard', [
            'devices' => $devices,
            'alerts' => $alerts,
            'recent_activities' => $recent_activities,
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