<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Models\Alert;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AlertsController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        // Get devices through the many-to-many relationship
        $devices = $user->devices()->get();
        
        // Get alerts for all user's devices
        $alerts = Alert::whereIn('device_id', $devices->pluck('id'))
            ->with('device')
            ->latest()
            ->get();

        return Inertia::render('Parent/Alerts', [
            'devices' => $devices,
            'alerts' => $alerts,
        ]);
    }

    public function markAsRead(Alert $alert)
    {
        $this->authorize('update', $alert);
        
        $alert->update(['read_at' => now()]);

        return back();
    }

    public function markAllAsRead()
    {
        $user = Auth::user();
        $devices = $user->devices()->pluck('id');
        
        Alert::whereIn('device_id', $devices)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return back();
    }

    public function dismiss(Alert $alert)
    {
        $this->authorize('delete', $alert);
        
        $alert->delete();

        return back();
    }
} 