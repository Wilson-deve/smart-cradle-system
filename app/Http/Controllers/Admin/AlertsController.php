<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AlertsController extends Controller
{
    public function index()
    {
        $alerts = []; // TODO: Fetch alerts from database
        
        return Inertia::render('Admin/Alerts', [
            'alerts' => $alerts
        ]);
    }

    public function markAsRead(Request $request, $id)
    {
        // TODO: Implement mark as read logic
        return response()->json(['success' => true]);
    }
}