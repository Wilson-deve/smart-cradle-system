<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Setting;

class SettingsController extends Controller
{
    public function index()
    {
        $settings = [
            'system' => [
                'data_retention' => Setting::get('data_retention', '30 days'),
                'session_timeout' => Setting::get('session_timeout', '30 minutes'),
                'two_factor_auth' => Setting::get('two_factor_auth', 'optional'),
            ],
            'cloud' => [
                'api_endpoint' => Setting::get('cloud_api_endpoint'),
                'api_key' => Setting::get('cloud_api_key'),
                'sync_interval' => Setting::get('cloud_sync_interval', '5 minutes'),
                'storage_limit' => Setting::get('cloud_storage_limit', '10GB'),
            ],
            'notifications' => [
                'email_notifications' => Setting::get('email_notifications', 'all'),
                'push_notifications' => Setting::get('push_notifications', 'all'),
                'alert_threshold' => Setting::get('alert_threshold', 'medium'),
                'notification_channels' => Setting::get('notification_channels', ['email', 'push']),
            ],
            'monitoring' => [
                'camera_quality' => Setting::get('camera_quality', 'high'),
                'stream_retention' => Setting::get('stream_retention', '24 hours'),
                'sensor_polling_rate' => Setting::get('sensor_polling_rate', '5 seconds'),
            ],
            'security' => [
                'password_policy' => Setting::get('password_policy', 'strong'),
                'ip_whitelist' => Setting::get('ip_whitelist', []),
                'max_login_attempts' => Setting::get('max_login_attempts', 5),
            ]
        ];

        return Inertia::render('Admin/Settings', [
            'settings' => $settings
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'system.data_retention' => 'required|string',
            'system.session_timeout' => 'required|string',
            'system.two_factor_auth' => 'required|string',
            'cloud.api_endpoint' => 'nullable|url',
            'cloud.api_key' => 'nullable|string',
            'cloud.sync_interval' => 'required|string',
            'cloud.storage_limit' => 'required|string',
            'notifications.email_notifications' => 'required|string',
            'notifications.push_notifications' => 'required|string',
            'notifications.alert_threshold' => 'required|string',
            'notifications.notification_channels' => 'required|array',
            'monitoring.camera_quality' => 'required|string',
            'monitoring.stream_retention' => 'required|string',
            'monitoring.sensor_polling_rate' => 'required|string',
            'security.password_policy' => 'required|string',
            'security.ip_whitelist' => 'nullable|array',
            'security.max_login_attempts' => 'required|integer|min:1|max:10',
        ]);

        foreach ($validated as $category => $settings) {
            foreach ($settings as $key => $value) {
                Setting::set("${category}.${key}", $value);
            }
        }
        
        return back()->with('success', 'System settings updated successfully');
    }
} 