<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        return Inertia::render('Parent/Settings', [
            'settings' => [
                'notifications' => [
                    'email_notifications' => auth()->user()->settings['email_notifications'] ?? 'all',
                    'push_notifications' => auth()->user()->settings['push_notifications'] ?? 'all',
                    'alert_threshold' => auth()->user()->settings['alert_threshold'] ?? 'medium',
                ],
                'monitoring' => [
                    'camera_quality' => auth()->user()->settings['camera_quality'] ?? 'medium',
                    'stream_retention' => auth()->user()->settings['stream_retention'] ?? '24 hours',
                ],
                'privacy' => [
                    'data_sharing' => auth()->user()->settings['data_sharing'] ?? 'minimal',
                    'camera_access' => auth()->user()->settings['camera_access'] ?? 'authorized_only',
                ],
            ],
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'notifications.email_notifications' => ['required', 'string', 'in:all,important,none'],
            'notifications.push_notifications' => ['required', 'string', 'in:all,important,none'],
            'notifications.alert_threshold' => ['required', 'string', 'in:low,medium,high'],
            'monitoring.camera_quality' => ['required', 'string', 'in:low,medium,high'],
            'monitoring.stream_retention' => ['required', 'string', 'in:12 hours,24 hours,48 hours,72 hours'],
            'privacy.data_sharing' => ['required', 'string', 'in:minimal,moderate,full'],
            'privacy.camera_access' => ['required', 'string', 'in:authorized_only,all_babysitters,family_only'],
        ]);

        $user = auth()->user();
        $user->settings = array_merge($user->settings ?? [], [
            'email_notifications' => $validated['notifications']['email_notifications'],
            'push_notifications' => $validated['notifications']['push_notifications'],
            'alert_threshold' => $validated['notifications']['alert_threshold'],
            'camera_quality' => $validated['monitoring']['camera_quality'],
            'stream_retention' => $validated['monitoring']['stream_retention'],
            'data_sharing' => $validated['privacy']['data_sharing'],
            'camera_access' => $validated['privacy']['camera_access'],
        ]);
        $user->save();

        return redirect()->back()->with('success', 'Settings updated successfully.');
    }
} 