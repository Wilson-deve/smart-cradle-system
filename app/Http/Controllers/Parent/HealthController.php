<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Models\Device;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HealthController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        // Get devices associated with the parent through the pivot table
        $devices = $user->devices()
            ->with(['sensorReadings', 'logs'])
            ->orderBy('last_activity_at', 'desc')
            ->get();
        
        return Inertia::render('Parent/Health', [
            'devices' => $devices,
        ]);
    }

    public function getAnalytics(Device $device)
    {
        $this->authorize('view', $device);
        
        $device->load(['sensorReadings', 'logs']);
        
        return response()->json([
            'device' => $device,
            'analytics' => [
                'temperature_history' => $device->getTemperatureHistory(),
                'humidity_history' => $device->getHumidityHistory(),
                'noise_history' => $device->getNoiseHistory(),
                'sleep_patterns' => $device->getSleepPatterns(),
                'cry_analysis' => $device->getCryAnalysis(),
            ],
        ]);
    }
} 