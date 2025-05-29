<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Models\Babysitter;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BabysittersController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        // Get devices through the many-to-many relationship
        $devices = $user->devices()->get();
        
        // Get babysitters with their assigned devices
        $babysitters = Babysitter::where('parent_id', $user->id)
            ->with(['devices' => function($query) use ($devices) {
                $query->whereIn('devices.id', $devices->pluck('id'));
            }])
            ->get();

        return Inertia::render('Parent/Babysitters', [
            'devices' => $devices,
            'babysitters' => $babysitters,
        ]);
    }

    public function store()
    {
        request()->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string|max:20',
            'device_ids' => 'required|array',
            'device_ids.*' => 'exists:devices,id'
        ]);

        $user = Auth::user();
        
        // Create babysitter
        $babysitter = Babysitter::create([
            'parent_id' => $user->id,
            'name' => request('name'),
            'email' => request('email'),
            'phone' => request('phone'),
            'status' => 'active'
        ]);

        // Attach devices
        $babysitter->devices()->attach(request('device_ids'));

        return back();
    }

    public function update(Babysitter $babysitter)
    {
        $this->authorize('update', $babysitter);
        
        request()->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'device_ids' => 'required|array',
            'device_ids.*' => 'exists:devices,id'
        ]);

        $babysitter->update([
            'name' => request('name'),
            'phone' => request('phone')
        ]);

        // Sync devices
        $babysitter->devices()->sync(request('device_ids'));

        return back();
    }

    public function destroy(Babysitter $babysitter)
    {
        $this->authorize('delete', $babysitter);
        
        $babysitter->devices()->detach();
        $babysitter->delete();

        return back();
    }

    public function toggleStatus(Babysitter $babysitter)
    {
        $this->authorize('update', $babysitter);
        
        $babysitter->update([
            'status' => $babysitter->status === 'active' ? 'inactive' : 'active'
        ]);

        return back();
    }
} 