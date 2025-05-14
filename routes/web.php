<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\MonitoringController;
use App\Http\Controllers\Admin\SystemLogController;
use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\DeviceController;
use App\Http\Controllers\Admin\AlertController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\BabysitterController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::get('/dashboard', function () {
//         return Inertia::render('Dashboard');
//     })->name('dashboard');

// Authenticated routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Main dashboard redirect
    Route::get('/dashboard', function () {
        $user = auth()->user();
        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        } else if ($user->isParent()) {
            return redirect()->route('parent.dashboard');
        } else if ($user->isBabysitter()) {
            return redirect()->route('babysitter.dashboard');
        }
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // Parent routes
    Route::prefix('parent')->middleware(['role:parent'])->group(function () {
        Route::get('/devices', [DeviceController::class, 'index'])->name('parent.devices.index');
        Route::get('/monitoring', [MonitoringController::class, 'index'])->name('parent.monitoring.index');
        Route::get('/health', [HealthController::class, 'index'])->name('parent.health.index');
        Route::get('/alerts', [AlertController::class, 'index'])->name('parent.alerts.index');
    });

    // Admin routes
    Route::prefix('admin')->middleware(['role:admin'])->group(function () {
        Route::get('/devices', [DeviceController::class, 'index'])->middleware('permission:device.view')->name('admin.devices.index');
        Route::get('/monitoring', [MonitoringController::class, 'index'])->middleware('permission:monitoring.view')->name('admin.monitoring.index');
        Route::get('/health', [HealthController::class, 'index'])->middleware('permission:device.health')->name('admin.health.index');
        Route::get('/alerts', [AlertController::class, 'index'])->middleware('permission:alerts.view')->name('admin.alerts.index');
        
        // Permission management routes
        Route::get('/permissions', [PermissionController::class, 'index'])->name('admin.permissions.index');
        Route::post('/permissions/{role}/toggle/{permission}', [PermissionController::class, 'togglePermission'])->name('admin.permissions.toggle');
        Route::post('/permissions/create', [PermissionController::class, 'createPermission'])->name('admin.permissions.create');
        Route::put('/permissions/{permission}', [PermissionController::class, 'updatePermission'])->name('admin.permissions.update');
        Route::delete('/permissions/{permission}', [PermissionController::class, 'deletePermission'])->name('admin.permissions.delete');
    });
});

// Admin Routes
Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
    
    // User Management
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::get('/users/{user}', [UserController::class, 'show'])->name('users.show');
    Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
    Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    Route::put('/users/{user}/password', [UserController::class, 'updatePassword'])->name('users.password');
    Route::post('/users/{user}/roles', [UserController::class, 'assignRole'])->name('users.roles.assign');
    Route::delete('/users/{user}/roles', [UserController::class, 'removeRole'])->name('users.roles.remove');
    
    // Device Management
    Route::get('/devices', [DeviceController::class, 'index'])->name('devices.index');
    Route::get('/devices/create', [DeviceController::class, 'create'])->name('devices.create');
    Route::post('/devices', [DeviceController::class, 'store'])->name('devices.store');
    Route::get('/devices/{device}', [DeviceController::class, 'show'])->name('devices.show');
    Route::get('/devices/{device}/edit', [DeviceController::class, 'edit'])->name('devices.edit');
    Route::put('/devices/{device}', [DeviceController::class, 'update'])->name('devices.update');
    Route::delete('/devices/{device}', [DeviceController::class, 'destroy'])->name('devices.destroy');
    
    // Monitoring
    Route::get('/monitoring', [MonitoringController::class, 'index'])->name('monitoring.index');
    Route::get('/monitoring/{device}', [MonitoringController::class, 'getDeviceData'])->name('monitoring.device');
    Route::get('/monitoring/{device}/camera', [MonitoringController::class, 'getCameraFeed'])->name('monitoring.camera');
    Route::get('/monitoring/{device}/health', [MonitoringController::class, 'getHealthAnalytics'])->name('monitoring.health');
    
    // Health Analytics
    Route::get('/health', function () {
        return Inertia::render('Admin/Health/Index');
    })->name('health.index');
    
    // Alerts
    Route::prefix('alerts')->name('alerts.')->group(function () {
        Route::get('/', [AlertController::class, 'index'])->name('index')->middleware('permission:manage_alerts');
        Route::get('/{alert}', [AlertController::class, 'show'])->name('show')->middleware('permission:manage_alerts');
        Route::put('/{alert}/read', [AlertController::class, 'markAsRead'])->name('read')->middleware('permission:manage_alerts');
        Route::put('/read-all', [AlertController::class, 'markAllAsRead'])->name('read-all')->middleware('permission:manage_alerts');
    });
    
    // System Logs
    Route::get('/logs', [SystemLogController::class, 'index'])->name('logs.index');
    Route::get('/logs/{log}', [SystemLogController::class, 'show'])->name('logs.show');
    
    // Permissions Management
    Route::get('/permissions', [PermissionController::class, 'index'])->name('permissions.index');
    Route::post('/permissions', [PermissionController::class, 'store'])->name('permissions.store');
    Route::put('/permissions/{role}', [PermissionController::class, 'update'])->name('permissions.update');
    Route::delete('/permissions/{role}', [PermissionController::class, 'destroy'])->name('permissions.destroy');
    Route::post('/permissions/{role}/toggle/{permission}', [PermissionController::class, 'togglePermission'])->name('permissions.toggle');
    
    // Settings
    Route::get('/settings', [AdminController::class, 'settings'])->name('settings');
    Route::put('/settings', [AdminController::class, 'updateSettings'])->name('settings.update');
});

// Parent Routes
Route::middleware(['auth', 'verified', 'role:parent'])->prefix('parent')->name('parent.')->group(function () {
    // Dashboard
    Route::get('/dashboard', [App\Http\Controllers\Parent\DashboardController::class, 'index'])->name('dashboard');
    Route::patch('/devices/{device}/controls', [App\Http\Controllers\Parent\DashboardController::class, 'toggleControl'])->name('devices.controls.toggle');
    Route::post('/babysitters', [App\Http\Controllers\Parent\DashboardController::class, 'addBabysitter'])->name('babysitters.store');
    Route::delete('/babysitters/{babysitter}', [App\Http\Controllers\Parent\DashboardController::class, 'removeBabysitter'])->name('babysitters.destroy');

    // Real-time Monitoring
    Route::get('/monitoring', [MonitoringController::class, 'index'])->name('monitoring.index');
    Route::get('/monitoring/{device}/data', [MonitoringController::class, 'getDeviceData'])->name('monitoring.data');
    Route::get('/monitoring/{device}/camera', [MonitoringController::class, 'getCameraFeed'])->name('monitoring.camera');
    Route::get('/monitoring/{device}/status', [MonitoringController::class, 'getDeviceStatus'])->name('monitoring.status');

    // Cradle Controls
    Route::prefix('controls')->name('controls.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('Parent/Controls');
        })->name('index');
        Route::post('/{device}/swing', [DeviceController::class, 'toggleSwing'])->name('swing');
        Route::post('/{device}/swing/speed', [DeviceController::class, 'setSwingSpeed'])->name('swing.speed');
        Route::post('/{device}/lullaby', [DeviceController::class, 'toggleLullaby'])->name('lullaby');
        Route::post('/{device}/projector', [DeviceController::class, 'toggleProjector'])->name('projector');
    });

    // Media & Lullabies
    Route::prefix('media')->name('media.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('Parent/Media');
        })->name('index');
        Route::get('/lullabies', [MediaController::class, 'getLullabies'])->name('lullabies');
        Route::post('/{device}/play', [MediaController::class, 'playMedia'])->name('play');
        Route::post('/{device}/stop', [MediaController::class, 'stopMedia'])->name('stop');
    });

    // Health Analytics
    Route::prefix('health')->name('health.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('Parent/Health');
        })->name('index');
        Route::get('/{device}/analytics', [MonitoringController::class, 'getHealthAnalytics'])->name('analytics');
        Route::get('/{device}/history', [MonitoringController::class, 'getHealthHistory'])->name('history');
    });

    // Alerts
    Route::prefix('alerts')->name('alerts.')->middleware('permission:view_alerts')->group(function () {
        Route::get('/', [AlertController::class, 'index'])->name('index');
        Route::get('/{alert}', [AlertController::class, 'show'])->name('show');
        Route::put('/{alert}/read', [AlertController::class, 'markAsRead'])->name('read');
        Route::put('/read-all', [AlertController::class, 'markAllAsRead'])->name('read-all');
    });

    // Babysitter Management
    Route::prefix('babysitters')->name('babysitters.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('Parent/Babysitters');
        })->name('index');
        Route::get('/list', [BabysitterController::class, 'index'])->name('list');
        Route::post('/invite', [BabysitterController::class, 'invite'])->name('invite');
        Route::put('/{babysitter}/permissions', [BabysitterController::class, 'updatePermissions'])->name('permissions.update');
        Route::delete('/{babysitter}', [BabysitterController::class, 'remove'])->name('remove');
    });
});

// Babysitter Routes
Route::middleware(['auth', 'verified', 'role:babysitter'])->prefix('babysitter')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Babysitter/Dashboard');
    })->name('babysitter.dashboard');
});

// Admin Profile Routes
Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/profile', [App\Http\Controllers\Admin\ProfileController::class, 'edit'])->name('admin.profile.edit');
    Route::patch('/profile', [App\Http\Controllers\Admin\ProfileController::class, 'update'])->name('admin.profile.update');
    Route::patch('/profile/password', [App\Http\Controllers\Admin\ProfileController::class, 'updatePassword'])->name('admin.profile.password');
    Route::delete('/profile', [App\Http\Controllers\Admin\ProfileController::class, 'destroy'])->name('admin.profile.destroy');
});

// Parent Profile Routes
Route::middleware(['auth', 'role:parent'])->prefix('parent')->group(function () {
    Route::get('/profile', [App\Http\Controllers\Parent\ProfileController::class, 'edit'])->name('parent.profile.edit');
    Route::patch('/profile', [App\Http\Controllers\Parent\ProfileController::class, 'update'])->name('parent.profile.update');
    Route::patch('/profile/password', [App\Http\Controllers\Parent\ProfileController::class, 'updatePassword'])->name('parent.profile.password');
    Route::delete('/profile', [App\Http\Controllers\Parent\ProfileController::class, 'destroy'])->name('parent.profile.destroy');
});

// Babysitter Profile Routes
Route::middleware(['auth', 'role:babysitter'])->prefix('babysitter')->group(function () {
    Route::get('/profile', [App\Http\Controllers\Babysitter\ProfileController::class, 'edit'])->name('babysitter.profile.edit');
    Route::patch('/profile', [App\Http\Controllers\Babysitter\ProfileController::class, 'update'])->name('babysitter.profile.update');
    Route::patch('/profile/password', [App\Http\Controllers\Babysitter\ProfileController::class, 'updatePassword'])->name('babysitter.profile.password');
    Route::delete('/profile', [App\Http\Controllers\Babysitter\ProfileController::class, 'destroy'])->name('babysitter.profile.destroy');
});

// Admin Dashboard Routes
Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('admin.dashboard');
});

// Parent Dashboard Routes
Route::middleware(['auth', 'role:parent'])->prefix('parent')->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\Parent\DashboardController::class, 'index'])->name('parent.dashboard');
    Route::patch('/devices/{device}/controls', [App\Http\Controllers\Parent\DashboardController::class, 'toggleControl'])->name('parent.devices.controls.toggle');
    Route::post('/babysitters', [App\Http\Controllers\Parent\DashboardController::class, 'addBabysitter'])->name('parent.babysitters.store');
    Route::delete('/babysitters/{babysitter}', [App\Http\Controllers\Parent\DashboardController::class, 'removeBabysitter'])->name('parent.babysitters.destroy');
});

// Babysitter Dashboard Routes
Route::middleware(['auth', 'role:babysitter'])->prefix('babysitter')->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\Babysitter\DashboardController::class, 'index'])->name('babysitter.dashboard');
    Route::patch('/devices/{device}/controls', [App\Http\Controllers\Babysitter\DashboardController::class, 'toggleControl'])->name('babysitter.devices.controls.toggle');
});

require __DIR__.'/auth.php';
