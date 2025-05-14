<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SystemLog;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;

class SystemLogController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request)
    {
        $this->authorize('viewAny', SystemLog::class);

        $query = SystemLog::with(['user', 'device'])
            ->when($request->type !== 'all', function ($query) use ($request) {
                return $query->where('log_type', $request->type);
            })
            ->latest();

        $logs = $query->paginate(15)
            ->through(function ($log) {
                return [
                    'id' => $log->id,
                    'type' => $log->type,
                    'message' => $log->message,
                    'user' => $log->user ? [
                        'name' => $log->user->name,
                    ] : null,
                    'device' => $log->device ? [
                        'name' => $log->device->name,
                    ] : null,
                    'created_at' => $log->created_at,
                ];
            });

        return Inertia::render('Admin/SystemLogs', [
            'logs' => $logs,
        ]);
    }

    public function show(SystemLog $log)
    {
        $this->authorize('view', $log);

        return response()->json([
            'log' => [
                'id' => $log->id,
                'type' => $log->type,
                'message' => $log->message,
                'user' => $log->user ? [
                    'name' => $log->user->name,
                ] : null,
                'device' => $log->device ? [
                    'name' => $log->device->name,
                ] : null,
                'created_at' => $log->created_at,
                'metadata' => $log->metadata,
            ],
        ]);
    }
} 