<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\MonitoringController;
use App\Http\Controllers\Admin\SystemLogController;
use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\DeviceController;
use App\Http\Controllers\Admin\AlertController;
use App\Http\Controllers\Admin\HealthController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\BabysitterController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Device;
use App\Models\Alert;
use App\Models\Activity;
use App\Models\Lullaby;
use App\Models\Babysitter;
use App\Http\Controllers\Parent\SettingsController;

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
        Route::get('/alerts', [AlertController::class, 'index'])->middleware('permission:manage_alerts')->name('admin.alerts.index');
        
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
    Route::get('/devices', [DeviceController::class, 'index'])->middleware('permission:device.view')->name('devices.index');
    Route::get('/devices/create', [DeviceController::class, 'create'])->name('devices.create');
    Route::post('/devices', [DeviceController::class, 'store'])->name('devices.store');
    Route::get('/devices/{device}', [DeviceController::class, 'show'])->name('devices.show');
    Route::get('/devices/{device}/edit', [DeviceController::class, 'edit'])->name('devices.edit');
    Route::put('/devices/{device}', [DeviceController::class, 'update'])->name('devices.update');
    Route::delete('/devices/{device}', [DeviceController::class, 'destroy'])->name('devices.destroy');
    
    // Monitoring
    Route::get('/monitoring', [MonitoringController::class, 'index'])->middleware('permission:monitoring.view')->name('monitoring.index');
    Route::get('/health', [HealthController::class, 'index'])->middleware('permission:device.health')->name('health.index');
    Route::get('/alerts', [AlertController::class, 'index'])->middleware('permission:manage_alerts')->name('alerts.index');
    
    // Permission management routes
    Route::get('/permissions', [PermissionController::class, 'index'])->name('permissions.index');
    Route::post('/permissions/{role}/toggle/{permission}', [PermissionController::class, 'togglePermission'])->name('permissions.toggle');
    Route::post('/permissions/create', [PermissionController::class, 'createPermission'])->name('permissions.create');
    Route::put('/permissions/{permission}', [PermissionController::class, 'updatePermission'])->name('permissions.update');
    Route::delete('/permissions/{permission}', [PermissionController::class, 'deletePermission'])->name('permissions.delete');

    Route::get('/settings', [App\Http\Controllers\Admin\SettingsController::class, 'index'])->name('admin.settings');
    Route::post('/settings', [App\Http\Controllers\Admin\SettingsController::class, 'update'])->name('admin.settings.update');
    
    Route::get('/alerts', [App\Http\Controllers\Admin\AlertsController::class, 'index'])->name('admin.alerts');
    Route::post('/alerts/{id}/read', [App\Http\Controllers\Admin\AlertsController::class, 'markAsRead'])->name('admin.alerts.read');

            Route::get('/logs', [App\Http\Controllers\Admin\LogController::class, 'index'])->name('logs.index');
    Route::get('/logs/download', [App\Http\Controllers\Admin\LogController::class, 'download'])->name('logs.download');
});

// Parent Routes
Route::middleware(['auth', 'verified', 'role:parent'])->prefix('parent')->name('parent.')->group(function () {
    // Dashboard
    Route::get('/dashboard', [App\Http\Controllers\Parent\DashboardController::class, 'index'])->name('dashboard');

    // Live Monitoring
    Route::get('/monitoring', [App\Http\Controllers\Parent\MonitoringController::class, 'index'])->name('monitoring.index');
    Route::get('/monitoring/{device}', [App\Http\Controllers\Parent\MonitoringController::class, 'show'])->name('monitoring.show');
    Route::get('/monitoring/{device}/data', [App\Http\Controllers\Parent\MonitoringController::class, 'getDeviceData'])->name('monitoring.data');
    Route::get('/monitoring/{device}/camera', [App\Http\Controllers\Parent\MonitoringController::class, 'getCameraFeed'])->name('monitoring.camera');

    // Health Reports
    Route::get('/health', [App\Http\Controllers\Parent\HealthController::class, 'index'])->name('health.index');
    Route::get('/health/{device}/analytics', [App\Http\Controllers\Parent\HealthController::class, 'getAnalytics'])->name('health.analytics');

    // Cradle Controls
    Route::get('/controls', [App\Http\Controllers\Parent\ControlsController::class, 'index'])->name('controls.index');
    Route::post('/controls/{device}/swing', [App\Http\Controllers\Parent\ControlsController::class, 'toggleSwing'])->name('controls.swing');
    Route::post('/controls/{device}/swing/speed', [App\Http\Controllers\Parent\ControlsController::class, 'setSwingSpeed'])->name('controls.swing.speed');
    Route::post('/controls/{device}/lullaby', [App\Http\Controllers\Parent\ControlsController::class, 'toggleLullaby'])->name('controls.lullaby');
    Route::post('/controls/{device}/projector', [App\Http\Controllers\Parent\ControlsController::class, 'toggleProjector'])->name('controls.projector');
    Route::post('/controls/{device}/volume', [App\Http\Controllers\Parent\ControlsController::class, 'setVolume'])->name('controls.volume');

    // Alerts & Notifications
    Route::get('/alerts', [App\Http\Controllers\Parent\AlertsController::class, 'index'])->name('alerts.index');
    Route::post('/alerts/{alert}/mark-read', [App\Http\Controllers\Parent\AlertsController::class, 'markAsRead'])->name('alerts.mark-read');
    Route::post('/alerts/mark-all-read', [App\Http\Controllers\Parent\AlertsController::class, 'markAllAsRead'])->name('alerts.mark-all-read');
    Route::delete('/alerts/{alert}', [App\Http\Controllers\Parent\AlertsController::class, 'dismiss'])->name('alerts.dismiss');

    // Babysitter Management
    Route::get('/babysitters', [App\Http\Controllers\Parent\BabysittersController::class, 'index'])->name('babysitters.index');
    Route::post('/babysitters', [App\Http\Controllers\Parent\BabysittersController::class, 'store'])->name('babysitters.store');
    Route::put('/babysitters/{babysitter}', [App\Http\Controllers\Parent\BabysittersController::class, 'update'])->name('babysitters.update');
    Route::delete('/babysitters/{babysitter}', [App\Http\Controllers\Parent\BabysittersController::class, 'destroy'])->name('babysitters.destroy');
    Route::put('/babysitters/{babysitter}/toggle-status', [App\Http\Controllers\Parent\BabysittersController::class, 'toggleStatus'])->name('babysitters.toggle-status');

    // Media Management
    Route::get('/media', [App\Http\Controllers\Parent\MediaController::class, 'index'])->name('media.index');
    Route::post('/media/lullaby/upload', [App\Http\Controllers\Parent\MediaController::class, 'uploadLullaby'])->name('media.lullaby.upload');
    Route::post('/media/content/upload', [App\Http\Controllers\Parent\MediaController::class, 'uploadContent'])->name('media.content.upload');
    Route::post('/media/lullaby/toggle/{device}/{lullaby}', [App\Http\Controllers\Parent\MediaController::class, 'toggleLullaby'])->name('media.lullaby.toggle');
    Route::post('/media/volume/{device}', [App\Http\Controllers\Parent\MediaController::class, 'setVolume'])->name('media.volume');
    Route::post('/media/projector/toggle/{device}', [App\Http\Controllers\Parent\MediaController::class, 'toggleProjector'])->name('media.projector.toggle');
    Route::post('/media/content/set/{device}/{content}', [App\Http\Controllers\Parent\MediaController::class, 'setContent'])->name('media.content.set');

    // Settings
    Route::get('/settings', [App\Http\Controllers\Parent\SettingsController::class, 'index'])->name('settings.index');
    Route::post('/settings', [App\Http\Controllers\Parent\SettingsController::class, 'update'])->name('settings.update');
});

// Babysitter Routes
Route::middleware(['auth', 'role:babysitter'])->prefix('babysitter')->group(function () {
    Route::get('/dashboard', [BabysitterController::class, 'index'])->name('babysitter.dashboard');
    Route::get('/monitoring', [BabysitterController::class, 'monitoringView'])->name('babysitter.monitoring');
    Route::get('/controls', [BabysitterController::class, 'controlsView'])->name('babysitter.controls');
    Route::get('/messages', [BabysitterController::class, 'messagesView'])->name('babysitter.messages');
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
