<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;

class Device extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'serial_number',
        'mac_address',
        'ip_address',
        'status',
        'settings',
        'last_activity_at',
        'battery_level',
        'signal_strength',
        'last_maintenance_at',
        'next_maintenance_at',
        'sensor_readings',
        'maintenance_history',
        'usage_statistics',
    ];

    protected $casts = [
        'settings' => 'array',
        'last_activity_at' => 'datetime',
        'last_maintenance_at' => 'datetime',
        'next_maintenance_at' => 'datetime',
        'sensor_readings' => 'array',
        'maintenance_history' => 'array',
        'usage_statistics' => 'array',
    ];

    protected static function boot()
    {
        parent::boot();

        static::created(function ($device) {
            $device->update(['last_activity_at' => now()]);
        });

        // Update last_activity_at when new sensor readings are added
        static::updated(function ($device) {
            if ($device->isDirty(['sensor_readings'])) {
                $device->update(['last_activity_at' => now()]);
            }
        });
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class)
            ->withPivot('relationship_type', 'permissions')
            ->withTimestamps();
    }

    public function logs(): HasMany
    {
        return $this->hasMany(DeviceLog::class);
    }

    public function alerts(): HasMany
    {
        return $this->hasMany(Alert::class);
    }

    public function sensorReadings(): HasMany
    {
        return $this->hasMany(SensorReading::class);
    }

    public function maintenanceRecords(): HasMany
    {
        return $this->hasMany(MaintenanceRecord::class);
    }

    public function notifications(): MorphMany
    {
        return $this->morphMany(Notification::class, 'notifiable');
    }

    public function settings(): HasOne
    {
        return $this->hasOne(DeviceSetting::class);
    }

    /**
     * Get the current lullaby through device settings.
     */
    public function currentLullaby()
    {
        return $this->hasOneThrough(
            Lullaby::class,
            DeviceSetting::class,
            'device_id', // Foreign key on device_settings table
            'id', // Foreign key on lullabies table
            'id', // Local key on devices table
            'current_lullaby_id' // Local key on device_settings table
        );
    }

    /**
     * Get the current projector content through device settings.
     */
    public function currentContent()
    {
        return $this->hasOneThrough(
            ProjectorContent::class,
            DeviceSetting::class,
            'device_id', // Foreign key on device_settings table
            'id', // Foreign key on projector_contents table
            'id', // Local key on devices table
            'current_content_id' // Local key on device_settings table
        );
    }

    public function getOwner()
    {
        return $this->users()
            ->wherePivot('relationship_type', 'owner')
            ->first();
    }

    public function hasUser(User $user): bool
    {
        return $this->users()
            ->where('user_id', $user->id)
            ->exists();
    }

    public function getUserPermissions(User $user): array
    {
        $pivot = $this->users()
            ->where('user_id', $user->id)
            ->first()?->pivot;

        return $pivot ? json_decode($pivot->permissions, true) ?? [] : [];
    }

    public function getCaretakers()
    {
        return $this->users()->wherePivot('relationship_type', 'caretaker');
    }

    public function getViewers()
    {
        return $this->users()->wherePivot('relationship_type', 'viewer');
    }

    public function isOnline(): bool
    {
        return $this->status === 'online';
    }

    public function needsMaintenance(): bool
    {
        return $this->next_maintenance_at <= now();
    }

    public function getBatteryStatus(): string
    {
        if ($this->battery_level >= 80) {
            return 'good';
        } elseif ($this->battery_level >= 40) {
            return 'fair';
        } else {
            return 'low';
        }
    }

    public function getNetworkStatus(): string
    {
        if ($this->signal_strength >= 80) {
            return 'excellent';
        } elseif ($this->signal_strength >= 60) {
            return 'good';
        } elseif ($this->signal_strength >= 40) {
            return 'fair';
        } else {
            return 'poor';
        }
    }

    public function getHealthStatus(): string
    {
        $issues = 0;
        
        if ($this->needsMaintenance()) {
            $issues++;
        }
        
        if ($this->battery_level < 20) {
            $issues++;
        }
        
        if ($this->signal_strength < 40) {
            $issues++;
        }
        
        if ($this->status !== 'online') {
            $issues++;
        }
        
        if ($issues === 0) {
            return 'healthy';
        } elseif ($issues === 1) {
            return 'warning';
        } else {
            return 'critical';
        }
    }

    public function getUsageStatistics(): array
    {
        $last24Hours = now()->subHours(24);
        
        return [
            'swing_time' => $this->logs()
                ->where('action', 'swing_control')
                ->where('created_at', '>=', $last24Hours)
                ->sum('duration'),
            'music_playtime' => $this->logs()
                ->where('action', 'music_control')
                ->where('created_at', '>=', $last24Hours)
                ->sum('duration'),
            'projector_usage' => $this->logs()
                ->where('action', 'projector_control')
                ->where('created_at', '>=', $last24Hours)
                ->sum('duration'),
        ];
    }

    public function getSensorReadings(): array
    {
        $lastReading = $this->sensorReadings()
            ->latest()
            ->first();
            
        return [
            'temperature' => $lastReading?->temperature,
            'humidity' => $lastReading?->humidity,
            'noise_level' => $lastReading?->noise_level,
            'light_level' => $lastReading?->light_level,
            'movement_detected' => $lastReading?->movement_detected,
            'wetness_detected' => $lastReading?->wetness_detected,
            'timestamp' => $lastReading?->created_at,
        ];
    }

    public function getRecentAlerts(int $limit = 5): array
    {
        return $this->alerts()
            ->latest()
            ->limit($limit)
            ->get()
            ->toArray();
    }

    public function getMaintenanceHistory(): array
    {
        return $this->maintenanceRecords()
            ->latest()
            ->limit(10)
            ->get()
            ->map(function ($record) {
                return [
                    'type' => $record->type,
                    'description' => $record->description,
                    'performed_at' => $record->performed_at->toIso8601String(),
                    'next_maintenance_due' => $record->next_maintenance_due->toIso8601String(),
                ];
            })
            ->toArray();
    }

    public function statusLabel(): Attribute{
        return Attribute::make(
            get:fn () => match($this->status) {
                'online' => 'Online',
                'offline' => 'Offline',
                'maintenance' => 'Maintenance',
                default => 'Unknown',
            }
        );
    }
}
