<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Models\Device;
use App\Models\Lullaby;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ControlsController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        // Get devices through the many-to-many relationship
        $devices = $user->devices()
            ->with(['settings', 'currentLullaby'])
            ->get();
            
        // Get all available lullabies
        $lullabies = Lullaby::all();

        return Inertia::render('Parent/Controls', [
            'devices' => $devices,
            'lullabies' => $lullabies,
        ]);
    }

    public function toggleSwing(Device $device)
    {
        $this->authorize('control', $device);
        
        $device->update([
            'swing_enabled' => !$device->swing_enabled
        ]);

        return back();
    }

    public function setSwingSpeed(Device $device)
    {
        $this->authorize('control', $device);
        
        request()->validate([
            'speed' => 'required|integer|between:1,5'
        ]);

        $device->update([
            'swing_speed' => request('speed')
        ]);

        return back();
    }

    public function toggleLullaby(Device $device)
    {
        $this->authorize('control', $device);
        
        request()->validate([
            'lullaby_id' => 'required|exists:lullabies,id'
        ]);

        $device->update([
            'lullaby_enabled' => !$device->lullaby_enabled,
            'current_lullaby_id' => request('lullaby_id')
        ]);

        return back();
    }

    public function toggleProjector(Device $device)
    {
        $this->authorize('control', $device);
        
        $device->update([
            'projector_enabled' => !$device->projector_enabled
        ]);

        return back();
    }

    public function setVolume(Device $device)
    {
        $this->authorize('control', $device);
        
        request()->validate([
            'volume' => 'required|integer|between:0,100'
        ]);

        $device->update([
            'volume' => request('volume')
        ]);

        return back();
    }
} 