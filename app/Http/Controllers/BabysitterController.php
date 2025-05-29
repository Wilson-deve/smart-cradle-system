<?php

namespace App\Http\Controllers;

use App\Models\Device;
use App\Models\User;
use App\Models\Notification;
use App\Models\Message;
use App\Models\Lullaby;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Events\BabysitterAlert;

class BabysitterController extends Controller
{
    public function index()
    {
        return Inertia::render('Babysitter/Dashboard');
    }

    public function monitoringView()
    {
        return Inertia::render('Babysitter/Monitoring');
    }

    public function controlsView()
    {
        return Inertia::render('Babysitter/Controls');
    }

    public function messagesView()
    {
        return Inertia::render('Babysitter/Messages');
    }

    public function dashboard()
    {
        $user = Auth::user();
        $assignedDevices = $user->assignedDevices()
            ->with(['baby', 'recentActivity', 'currentStatus', 'activeAlerts'])
            ->get();

        return response()->json([
            'assigned_babies' => $assignedDevices->map(function ($device) {
                return [
                    'id' => $device->id,
                    'name' => $device->baby->name,
                    'age' => $device->baby->age,
                    'status' => [
                        'sleeping' => $device->currentStatus->sleeping,
                        'crying' => $device->currentStatus->crying,
                        'active' => $device->currentStatus->active,
                    ],
                    'sensors' => [
                        'temperature' => $device->currentStatus->temperature,
                        'humidity' => $device->currentStatus->humidity,
                        'noise_level' => $device->currentStatus->noise_level,
                        'motion_detected' => $device->currentStatus->motion_detected,
                    ],
                    'device' => [
                        'id' => $device->id,
                        'swing_status' => $device->swing_status,
                        'lullaby_playing' => $device->lullaby_playing,
                        'projector_on' => $device->projector_on,
                        'current_lullaby' => $device->current_lullaby,
                        'swing_speed' => $device->swing_speed,
                    ],
                    'parent_contact' => [
                        'name' => $device->baby->parent->name,
                        'phone' => $device->baby->parent->phone,
                    ],
                ];
            }),
        ]);
    }

    public function monitoring()
    {
        $user = Auth::user();
        $assignedDevices = $user->assignedDevices()
            ->with(['baby', 'currentStatus'])
            ->get();

        return response()->json([
            'assigned_babies' => $assignedDevices->map(function ($device) {
                return [
                    'id' => $device->id,
                    'name' => $device->baby->name,
                    'age' => $device->baby->age,
                    'camera_url' => $device->camera_url,
                    'sensors' => [
                        'temperature' => $device->currentStatus->temperature,
                        'humidity' => $device->currentStatus->humidity,
                        'noise_level' => $device->currentStatus->noise_level,
                        'motion_detected' => $device->currentStatus->motion_detected,
                    ],
                    'status' => [
                        'sleeping' => $device->currentStatus->sleeping,
                        'crying' => $device->currentStatus->crying,
                        'active' => $device->currentStatus->active,
                    ],
                ];
            }),
        ]);
    }

    public function controls()
    {
        $user = Auth::user();
        $assignedDevices = $user->assignedDevices()
            ->with(['baby', 'parentSettings'])
            ->get();

        return response()->json([
            'assigned_babies' => $assignedDevices->map(function ($device) {
                return [
                    'id' => $device->id,
                    'name' => $device->baby->name,
                    'age' => $device->baby->age,
                    'device' => [
                        'id' => $device->id,
                        'swing_status' => $device->swing_status,
                        'swing_speed' => $device->swing_speed,
                        'lullaby_playing' => $device->lullaby_playing,
                        'current_lullaby' => $device->current_lullaby,
                        'lullaby_volume' => $device->lullaby_volume,
                        'projector_on' => $device->projector_on,
                        'projector_brightness' => $device->projector_brightness,
                    ],
                    'parent_settings' => [
                        'allow_swing_control' => $device->parentSettings->allow_swing_control,
                        'allow_lullaby_control' => $device->parentSettings->allow_lullaby_control,
                        'allow_projector_control' => $device->parentSettings->allow_projector_control,
                        'max_swing_speed' => $device->parentSettings->max_swing_speed,
                        'max_volume' => $device->parentSettings->max_volume,
                        'max_brightness' => $device->parentSettings->max_brightness,
                    ],
                ];
            }),
        ]);
    }

    public function lullabies()
    {
        $lullabies = Lullaby::all();

        return response()->json([
            'lullabies' => $lullabies->map(function ($lullaby) {
                return [
                    'id' => $lullaby->id,
                    'name' => $lullaby->name,
                    'duration' => $lullaby->duration,
                ];
            }),
        ]);
    }

    public function notifications()
    {
        $user = Auth::user();
        $notifications = $user->notifications()
            ->orderBy('created_at', 'desc')
            ->take(50)
            ->get();

        return response()->json($notifications);
    }

    public function markNotificationAsRead(Notification $notification)
    {
        $notification->markAsRead();
        return response()->json(['message' => 'Notification marked as read']);
    }

    public function controlSwing(Request $request, Device $device)
    {
        $this->authorize('control', $device);
        $this->validateParentPermission($device, 'swing');

        $validated = $request->validate([
            'action' => 'required|in:start,stop',
            'speed' => 'nullable|integer|min:1|max:10',
        ]);

        $device->swing_status = $validated['action'] === 'start';
        if (isset($validated['speed'])) {
            $device->swing_speed = min($validated['speed'], $device->parentSettings->max_swing_speed);
        }
        $device->save();

        return response()->json(['message' => 'Swing control updated successfully']);
    }

    public function controlLullaby(Request $request, Device $device)
    {
        $this->authorize('control', $device);
        $this->validateParentPermission($device, 'lullaby');

        $validated = $request->validate([
            'action' => 'required|in:play,stop',
            'lullaby_id' => 'nullable|exists:lullabies,id',
            'volume' => 'nullable|integer|min:0|max:100',
        ]);

        $device->lullaby_playing = $validated['action'] === 'play';
        if (isset($validated['lullaby_id'])) {
            $device->current_lullaby = $validated['lullaby_id'];
        }
        if (isset($validated['volume'])) {
            $device->lullaby_volume = min($validated['volume'], $device->parentSettings->max_volume);
        }
        $device->save();

        return response()->json(['message' => 'Lullaby control updated successfully']);
    }

    public function controlProjector(Request $request, Device $device)
    {
        $this->authorize('control', $device);
        $this->validateParentPermission($device, 'projector');

        $validated = $request->validate([
            'action' => 'required|in:on,off',
            'brightness' => 'nullable|integer|min:10|max:100',
        ]);

        $device->projector_on = $validated['action'] === 'on';
        if (isset($validated['brightness'])) {
            $device->projector_brightness = min($validated['brightness'], $device->parentSettings->max_brightness);
        }
        $device->save();

        return response()->json(['message' => 'Projector control updated successfully']);
    }

    private function validateParentPermission(Device $device, string $control)
    {
        $settings = $device->parentSettings;
        $permission = "allow_{$control}_control";

        if (!$settings->$permission) {
            abort(403, ucfirst($control) . ' control is not allowed by parent');
        }
    }
} 