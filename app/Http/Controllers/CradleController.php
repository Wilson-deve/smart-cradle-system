<?php

namespace App\Http\Controllers;

use App\Models\Device;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CradleController extends Controller
{
    /**
     * Display the cradle control panel.
     */
    public function index(Device $device)
    {
        $this->authorize('control', $device);
        
        return Inertia::render('Cradle/Index', [
            'device' => $device,
        ]);
    }

    /**
     * Control the cradle swing.
     */
    public function controlSwing(Request $request, Device $device)
    {
        $this->authorize('control', $device);
        
        $validated = $request->validate([
            'action' => 'required|in:start,stop',
            'speed' => 'required_if:action,start|integer|min:1|max:5',
        ]);
        
        // This is a placeholder for the actual implementation
        // In a real application, you would send a command to the device
        
        // Log the control action
        activity()
            ->performedOn($device)
            ->causedBy(Auth::user())
            ->withProperties([
                'action' => 'swing_control',
                'parameters' => $validated,
            ])
            ->log('cradle_control');
        
        return response()->json([
            'success' => true,
            'message' => 'Swing ' . $validated['action'] . ' command sent successfully.',
        ]);
    }

    /**
     * Control the cradle music.
     */
    public function controlMusic(Request $request, Device $device)
    {
        $this->authorize('control', $device);
        
        $validated = $request->validate([
            'action' => 'required|in:play,stop,pause,next,previous',
            'track_id' => 'required_if:action,play|integer',
            'volume' => 'required_if:action,play|integer|min:0|max:100',
        ]);
        
        // This is a placeholder for the actual implementation
        // In a real application, you would send a command to the device
        
        // Log the control action
        activity()
            ->performedOn($device)
            ->causedBy(Auth::user())
            ->withProperties([
                'action' => 'music_control',
                'parameters' => $validated,
            ])
            ->log('cradle_control');
        
        return response()->json([
            'success' => true,
            'message' => 'Music ' . $validated['action'] . ' command sent successfully.',
        ]);
    }

    /**
     * Control the cradle projector.
     */
    public function controlProjector(Request $request, Device $device)
    {
        $this->authorize('control', $device);
        
        $validated = $request->validate([
            'action' => 'required|in:on,off',
            'pattern' => 'required_if:action,on|string',
            'brightness' => 'required_if:action,on|integer|min:0|max:100',
        ]);
        
        // This is a placeholder for the actual implementation
        // In a real application, you would send a command to the device
        
        // Log the control action
        activity()
            ->performedOn($device)
            ->causedBy(Auth::user())
            ->withProperties([
                'action' => 'projector_control',
                'parameters' => $validated,
            ])
            ->log('cradle_control');
        
        return response()->json([
            'success' => true,
            'message' => 'Projector ' . $validated['action'] . ' command sent successfully.',
        ]);
    }

    /**
     * Get available music tracks.
     */
    public function getMusicTracks(Device $device)
    {
        $this->authorize('control', $device);
        
        // This is a placeholder for the actual implementation
        // In a real application, you would fetch music tracks from a database
        
        $tracks = [
            [
                'id' => 1,
                'title' => 'Twinkle Twinkle Little Star',
                'duration' => '2:30',
                'category' => 'Lullaby',
            ],
            [
                'id' => 2,
                'title' => 'Rock-a-Bye Baby',
                'duration' => '2:15',
                'category' => 'Lullaby',
            ],
            [
                'id' => 3,
                'title' => 'Hush Little Baby',
                'duration' => '2:45',
                'category' => 'Lullaby',
            ],
            [
                'id' => 4,
                'title' => 'Brahms Lullaby',
                'duration' => '3:00',
                'category' => 'Classical',
            ],
            [
                'id' => 5,
                'title' => 'White Noise',
                'duration' => '10:00',
                'category' => 'Ambient',
            ],
        ];
        
        return response()->json($tracks);
    }

    /**
     * Get available projector patterns.
     */
    public function getProjectorPatterns(Device $device)
    {
        $this->authorize('control', $device);
        
        // This is a placeholder for the actual implementation
        // In a real application, you would fetch projector patterns from a database
        
        $patterns = [
            [
                'id' => 1,
                'name' => 'Stars',
                'description' => 'Twinkling stars on a dark background',
            ],
            [
                'id' => 2,
                'name' => 'Ocean',
                'description' => 'Calm ocean waves',
            ],
            [
                'id' => 3,
                'name' => 'Forest',
                'description' => 'Peaceful forest scene',
            ],
            [
                'id' => 4,
                'name' => 'Rainbow',
                'description' => 'Colorful rainbow pattern',
            ],
            [
                'id' => 5,
                'name' => 'Animals',
                'description' => 'Cute animal silhouettes',
            ],
        ];
        
        return response()->json($patterns);
    }

    /**
     * Get cradle settings.
     */
    public function getSettings(Device $device)
    {
        $this->authorize('view', $device);
        
        // This is a placeholder for the actual implementation
        // In a real application, you would fetch settings from the device or database
        
        $settings = [
            'swing' => [
                'enabled' => true,
                'speed' => 3,
                'timer' => 30, // minutes
            ],
            'music' => [
                'enabled' => true,
                'volume' => 50,
                'repeat' => true,
                'shuffle' => false,
            ],
            'projector' => [
                'enabled' => true,
                'brightness' => 70,
                'pattern' => 1,
                'timer' => 30, // minutes
            ],
            'notifications' => [
                'crying' => true,
                'movement' => true,
                'wetness' => true,
                'temperature' => true,
            ],
        ];
        
        return response()->json($settings);
    }

    /**
     * Update cradle settings.
     */
    public function updateSettings(Request $request, Device $device)
    {
        $this->authorize('update', $device);
        
        $validated = $request->validate([
            'settings' => 'required|array',
        ]);
        
        // Update device settings
        $device->update([
            'settings' => $validated['settings'],
        ]);
        
        // Log the settings update
        activity()
            ->performedOn($device)
            ->causedBy(Auth::user())
            ->withProperties([
                'action' => 'settings_update',
                'parameters' => $validated['settings'],
            ])
            ->log('cradle_settings');
        
        return response()->json([
            'success' => true,
            'message' => 'Settings updated successfully.',
        ]);
    }
} 