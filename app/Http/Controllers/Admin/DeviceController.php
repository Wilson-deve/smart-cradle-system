<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Device;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DeviceController extends Controller
{
    /**
     * Display a listing of the devices.
     */
    public function index()
    {
        $this->authorize('viewAny', Device::class);
        
        $devices = Device::with(['users', 'logs', 'alerts'])
            ->orderBy('last_activity_at', 'desc')
            ->get();
        
        $users = User::whereHas('roles', function ($query) {
            $query->whereIn('name', ['parent', 'babysitter']);
        })
        ->with('roles')
        ->select('id', 'name', 'email')
        ->get()
        ->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->roles->first()->name
            ];
        });
        
        return Inertia::render('Admin/Devices/Index', [
            'devices' => $devices,
            'users' => $users,
        ]);
    }

    /**
     * Show the form for creating a new device.
     */
    public function create()
    {
        $this->authorize('create', Device::class);
        
        $users = User::all();
        
        return Inertia::render('Admin/Devices/Create', [
            'users' => $users,
        ]);
    }

    /**
     * Store a newly created device in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', Device::class);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'serial_number' => 'required|string|max:255|unique:devices',
            'mac_address' => 'required|string|max:255|unique:devices',
            'ip_address' => 'required|string|max:255',
            'owner_id' => 'required|exists:users,id',
        ]);
        
        $device = Device::create([
            'name' => $validated['name'],
            'serial_number' => $validated['serial_number'],
            'mac_address' => $validated['mac_address'],
            'ip_address' => $validated['ip_address'],
            'status' => 'offline',
            'settings' => [
                'swing' => ['enabled' => false],
                'music' => ['enabled' => false],
                'projector' => ['enabled' => false],
                'camera' => [
                    'stream_url' => null,
                    'status' => 'offline',
                    'night_vision' => false,
                ],
            ],
        ]);
        
        // Assign owner
        $device->users()->attach($validated['owner_id'], [
            'relationship_type' => 'owner',
            'permissions' => json_encode(['view', 'control', 'manage']),
        ]);
        
        return redirect()->route('admin.devices.index')
            ->with('success', 'Device created successfully.');
    }

    /**
     * Display the specified device.
     */
    public function show(Device $device)
    {
        $this->authorize('view', $device);
        
        $device->load(['users', 'logs', 'alerts', 'sensorReadings']);
        
        return Inertia::render('Admin/Devices/Show', [
            'device' => $device,
        ]);
    }

    /**
     * Show the form for editing the specified device.
     */
    public function edit(Device $device)
    {
        $this->authorize('update', $device);
        
        $users = User::whereHas('roles', function ($query) {
            $query->whereIn('name', ['parent', 'babysitter']);
        })
        ->with('roles')
        ->select('id', 'name', 'email')
        ->get()
        ->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->roles->first()->name
            ];
        });
        
        $device->load('users');
        
        return Inertia::render('Admin/Devices/Edit', [
            'device' => $device,
            'users' => $users,
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
            'serial_number' => 'required|string|max:255|unique:devices,serial_number,' . $device->id,
            'mac_address' => 'required|string|max:255|unique:devices,mac_address,' . $device->id,
            'ip_address' => 'required|string|max:255',
            'status' => 'required|in:online,offline,maintenance',
            'owner_id' => 'required|exists:users,id',
        ]);
        
        $device->update([
            'name' => $validated['name'],
            'serial_number' => $validated['serial_number'],
            'mac_address' => $validated['mac_address'],
            'ip_address' => $validated['ip_address'],
            'status' => $validated['status'],
        ]);
        
        // Update owner if changed
        $currentOwner = $device->users()->wherePivot('relationship_type', 'owner')->first();
        if ($currentOwner && $currentOwner->id !== $validated['owner_id']) {
            $device->users()->detach($currentOwner->id);
            $device->users()->attach($validated['owner_id'], [
                'relationship_type' => 'owner',
                'permissions' => json_encode(['view', 'control', 'manage']),
            ]);
        }
        
        return redirect()->route('admin.devices.show', $device)
            ->with('success', 'Device updated successfully.');
    }

    /**
     * Remove the specified device from storage.
     */
    public function destroy(Device $device)
    {
        $this->authorize('delete', $device);
        
        $device->delete();
        
        return redirect()->route('admin.devices.index')
            ->with('success', 'Device deleted successfully.');
    }
} 