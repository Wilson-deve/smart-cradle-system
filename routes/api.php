<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\CradleController;
use App\Http\Controllers\DeviceController;
use App\Http\Controllers\MonitoringController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->group(function () {
    // Admin routes
    Route::prefix('admin')->middleware('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard']);
        Route::get('/users', [AdminController::class, 'userManagement']);
        Route::get('/devices', [AdminController::class, 'deviceManagement']);
        Route::get('/logs', [AdminController::class, 'systemLogs']);
        Route::get('/alerts', [AdminController::class, 'alerts']);
        Route::get('/health', [AdminController::class, 'systemHealth']);
    });

    // Device routes
    Route::get('/devices', [DeviceController::class, 'index']);
    Route::post('/devices', [DeviceController::class, 'store']);
    Route::get('/devices/{device}', [DeviceController::class, 'show']);
    Route::put('/devices/{device}', [DeviceController::class, 'update']);
    Route::delete('/devices/{device}', [DeviceController::class, 'destroy']);
    Route::post('/devices/{device}/assign', [DeviceController::class, 'assignUser']);
    Route::delete('/devices/{device}/users/{user}', [DeviceController::class, 'removeUser']);
    Route::put('/devices/{device}/status', [DeviceController::class, 'updateStatus']);
    Route::post('/devices/{device}/control', [DeviceController::class, 'control']);

    // User routes
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::get('/users/{user}', [UserController::class, 'show']);
    Route::put('/users/{user}', [UserController::class, 'update']);
    Route::delete('/users/{user}', [UserController::class, 'destroy']);
    Route::put('/users/{user}/password', [UserController::class, 'updatePassword']);
    Route::post('/users/{user}/roles/{role}', [UserController::class, 'assignRole']);
    Route::delete('/users/{user}/roles/{role}', [UserController::class, 'removeRole']);

    // Monitoring routes
    Route::get('/monitoring', [MonitoringController::class, 'index']);
    Route::get('/monitoring/devices/{device}/data', [MonitoringController::class, 'getDeviceData']);
    Route::get('/monitoring/devices/{device}/camera', [MonitoringController::class, 'getCameraFeed']);
    Route::get('/monitoring/devices/{device}/health', [MonitoringController::class, 'getHealthAnalytics']);
    Route::get('/monitoring/alerts', [MonitoringController::class, 'getAlerts']);
    Route::put('/monitoring/alerts/{alert}/read', [MonitoringController::class, 'markAlertAsRead']);
    Route::put('/monitoring/alerts/read-all', [MonitoringController::class, 'markAllAlertsAsRead']);
    Route::get('/monitoring/logs', [MonitoringController::class, 'getSystemLogs']);

    // Cradle routes
    Route::get('/cradle/{device}', [CradleController::class, 'index']);
    Route::post('/cradle/{device}/swing', [CradleController::class, 'controlSwing']);
    Route::post('/cradle/{device}/music', [CradleController::class, 'controlMusic']);
    Route::post('/cradle/{device}/projector', [CradleController::class, 'controlProjector']);
    Route::get('/cradle/{device}/music-tracks', [CradleController::class, 'getMusicTracks']);
    Route::get('/cradle/{device}/projector-patterns', [CradleController::class, 'getProjectorPatterns']);
    Route::get('/cradle/{device}/settings', [CradleController::class, 'getSettings']);
    Route::put('/cradle/{device}/settings', [CradleController::class, 'updateSettings']);
}); 