<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Alert;
use App\Models\Device;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AlertController extends Controller
{
    /**
     * Display a listing of the alerts.
     */
    public function index()
    {
        $this->authorize('viewAny', Alert::class);
        
        $alerts = Alert::with(['device', 'user'])
            ->orderBy('created_at', 'desc')
            ->get();
        
        return Inertia::render('Admin/Alerts/Index', [
            'alerts' => $alerts,
        ]);
    }

    /**
     * Display the specified alert.
     */
    public function show(Alert $alert)
    {
        $this->authorize('view', $alert);
        
        $alert->load(['device', 'user']);
        
        return Inertia::render('Admin/Alerts/Show', [
            'alert' => $alert,
        ]);
    }

    /**
     * Mark an alert as read.
     */
    public function markAsRead(Alert $alert)
    {
        $this->authorize('update', $alert);
        
        $alert->update([
            'read_at' => now(),
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Alert marked as read.',
        ]);
    }

    /**
     * Mark all alerts as read.
     */
    public function markAllAsRead(Request $request)
    {
        $this->authorize('update', Alert::class);
        
        Alert::whereNull('read_at')
            ->update([
                'read_at' => now(),
            ]);
        
        return response()->json([
            'success' => true,
            'message' => 'All alerts marked as read.',
        ]);
    }
} 