<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HealthController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Health/Index', [
            'healthData' => [
                'systemStatus' => 'healthy',
                'lastCheck' => now()->format('Y-m-d H:i:s'),
                'metrics' => [
                    'cpu' => '25%',
                    'memory' => '45%',
                    'storage' => '60%',
                    'network' => 'stable'
                ]
            ]
        ]);
    }
} 