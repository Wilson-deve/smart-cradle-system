<?php

namespace App\Http\Controllers;

use App\Models\Device;
use App\Models\User;
use App\Services\DeviceService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class DeviceController extends Controller
{
    protected $deviceService;

    public function __construct(DeviceService $deviceService)
    {
        $this->deviceService = $deviceService;
    }

    /**
     * Display a listing of the devices.
     */
    public function index()
    {
        $this->authorize('viewAny', Device::class);

        $devices = Device::with(['users' => function ($query) {
            $query->where('user_id', Auth::id());
        }])->get();

        return Inertia::render('Devices/Index', [
            'devices' => $devices,
        ]);
    }

    /**
     * Show the form for creating a new device.
     */
    public function create()
    {
        $this->authorize('create', Device::class);
        
        return Inertia::render('Devices/Create');
    }

    /**
     * Store a newly created device in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', Device::class);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'serial_number' => 'required|string|unique:devices',
            'mac_address' => 'required|string|unique:devices',
            'firmware_version' => 'nullable|string',
        ]);
        
        $device = $this->deviceService->registerDevice($validated, Auth::user());
        
        return redirect()->route('devices.show', $device)
            ->with('success', 'Device registered successfully.');
    }

    /**
     * Display the specified device.
     */
    public function show(Device $device)
    {
        $this->authorize('view', $device);
        
        $device->load('users');
        $healthMetrics = $this->deviceService->getHealthMetrics($device);
        $usageStats = $this->deviceService->getUsageStatistics($device);
        $sensorData = $this->deviceService->getSensorData($device);
        
        return Inertia::render('Devices/Show', [
            'device' => $device,
            'healthMetrics' => $healthMetrics,
            'usageStats' => $usageStats,
            'sensorData' => $sensorData,
        ]);
    }

    /**
     * Show the form for editing the specified device.
     */
    public function edit(Device $device)
    {
        $this->authorize('update', $device);
        
        return Inertia::render('Devices/Edit', [
            'device' => $device,
        ]);
    }

    /**
     * Update the specified device in storage.
     */
    public function update(Request $request, Device $device)
    {
        $this->authorize('update', $device);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'firmware_version' => 'nullable|string',
        ]);
        
        $device = $this->deviceService->updateDevice($device, $validated);
        
        return redirect()->route('devices.show', $device)
            ->with('success', 'Device updated successfully.');
    }

    /**
     * Remove the specified device from storage.
     */
    public function destroy(Device $device)
    {
        $this->authorize('delete', $device);
        
        $device->delete();
        
        return redirect()->route('devices.index')
            ->with('success', 'Device deleted successfully.');
    }

    /**
     * Assign a device to a user.
     */
    public function assignUser(Request $request, Device $device)
    {
        $this->authorize('manageUsers', $device);
        
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'relationship_type' => 'required|in:owner,caretaker,viewer',
            'permissions' => 'required|array',
        ]);
        
        $user = User::findOrFail($validated['user_id']);
        
        $this->deviceService->assignUser($device, $user, $validated['relationship_type'], $validated['permissions']);
        
        return redirect()->route('devices.show', $device)
            ->with('success', 'User assigned successfully.');
    }

    /**
     * Remove a user from a device.
     */
    public function removeUser(Device $device, User $user)
    {
        $this->authorize('manageUsers', $device);
        
        $this->deviceService->removeUser($device, $user);
        
        return redirect()->route('devices.show', $device)
            ->with('success', 'User removed successfully.');
    }

    /**
     * Update device status.
     */
    public function updateStatus(Request $request, Device $device)
    {
        $this->authorize('control', $device);
        
        $validated = $request->validate([
            'status' => 'required|in:online,offline,maintenance',
        ]);
        
        $device = $this->deviceService->updateStatus($device, $validated['status']);
        
        return response()->json([
            'status' => 'success',
            'device' => $device,
        ]);
    }

    /**
     * Control device functions.
     */
    public function control(Request $request, Device $device)
    {
        $this->authorize('control', $device);
        
        $validated = $request->validate([
            'action' => 'required|string',
            'parameters' => 'nullable|array',
        ]);
        
        // Here you would implement the actual device control logic
        // This is a placeholder for the actual implementation
        
        // Log the control action
        activity()
            ->performedOn($device)
            ->causedBy(Auth::user())
            ->withProperties([
                'action' => $validated['action'],
                'parameters' => $validated['parameters'] ?? [],
            ])
            ->log('device_control');
        
        return response()->json([
            'success' => true,
            'message' => 'Control command sent successfully.',
        ]);
    }

    public function toggleSwing(Request $request, Device $device)
    {
        $this->authorize('control', $device);
        
        $device->update([
            'swing_enabled' => !$device->swing_enabled
        ]);

        return back();
    }

    public function setSwingSpeed(Request $request, Device $device)
    {
        $this->authorize('control', $device);
        
        $request->validate([
            'speed' => 'required|integer|min:1|max:5'
        ]);

        $device->update([
            'swing_speed' => $request->speed
        ]);

        return back();
    }

    public function toggleLullaby(Request $request, Device $device)
    {
        $this->authorize('control', $device);
        
        $device->update([
            'lullaby_playing' => !$device->lullaby_playing
        ]);

        return back();
    }

    public function toggleProjector(Request $request, Device $device)
    {
        $this->authorize('control', $device);
        
        $device->update([
            'projector_enabled' => !$device->projector_enabled
        ]);

        return back();
    }

    public function getStatus(Request $request, Device $device)
    {
        $this->authorize('view', $device);
        
        return response()->json([
            'swingEnabled' => $device->swing_enabled,
            'swingSpeed' => $device->swing_speed,
            'lullabyPlaying' => $device->lullaby_playing,
            'projectorEnabled' => $device->projector_enabled,
        ]);
    }
} 