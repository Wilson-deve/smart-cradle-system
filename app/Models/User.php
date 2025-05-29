<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'status',
        'last_active_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be appended to arrays.
     *
     * @var array<string>
     */
    protected $appends = ['permissions', 'role'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'last_active_at' => 'datetime',
            'settings' => 'array',
        ];
    }

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class);
    }

    public function devices(): BelongsToMany
    {
        return $this->belongsToMany(Device::class)
            ->withPivot('relationship_type', 'permissions')
            ->withTimestamps();
    }

    /**
     * Get devices assigned to the babysitter
     */
    public function assignedDevices(): BelongsToMany
    {
        return $this->devices()
            ->wherePivot('relationship_type', 'babysitter')
            ->withPivot(['permissions', 'relationship_type'])
            ->withTimestamps();
    }

    /**
     * Get all babysitters associated with this parent user.
     */
    public function babysitters(): HasMany
    {
        return $this->hasMany(Babysitter::class, 'parent_id');
    }

    /**
     * Get all parents associated with the devices this babysitter has access to.
     */
    public function parents(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'device_user', 'device_id', 'user_id')
            ->join('device_user as babysitter_devices', function ($join) {
                $join->on('device_user.device_id', '=', 'babysitter_devices.device_id')
                    ->where('babysitter_devices.user_id', '=', $this->id)
                    ->where('babysitter_devices.relationship_type', '=', 'babysitter');
            })
            ->where('device_user.relationship_type', '=', 'owner')
            ->select('users.*', 'device_user.relationship_type', 'device_user.permissions')
            ->distinct();
    }

    public function babyProfiles(): HasMany
    {
        return $this->hasMany(BabyProfile::class);
    }

    public function systemLogs(): HasMany
    {
        return $this->hasMany(SystemLog::class);
    }

    /**
     * Get all alerts associated with this user.
     */
    public function alerts(): HasMany
    {
        return $this->hasMany(Alert::class);
    }

    public function setRole(Role $role): void
    {
        // Remove all existing roles
        $this->roles()->detach();
        // Attach the new role
        $this->roles()->attach($role);
    }

    public function hasRole(string $role): bool
    {
        return $this->roles()
            ->where('slug', $role)
            ->exists();
    }

    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    public function isParent(): bool
    {
        return $this->hasRole('parent');
    }

    public function isBabysitter(): bool
    {
        return $this->hasRole('babysitter');
    }

    public function hasPermission(string $permission): bool
    {
        return $this->roles()
            ->whereHas('permissions', function ($query) use ($permission) {
                $query->where('slug', $permission);
            })
            ->exists();
    }

    public function hasDeviceAccess(Device $device): bool
    {
        return $this->hasRole('admin') || 
            $this->devices()
                ->where('device_id', $device->id)
                ->exists();
    }

    public function getDevicePermissions(Device $device): array
    {
        $pivot = $this->devices()
            ->where('device_id', $device->id)
            ->first()?->pivot;

        return $pivot ? json_decode($pivot->permissions, true) ?? [] : [];
    }

    /**
     * Get the user's permissions.
     */
    public function getPermissionsAttribute(): array
    {
        return $this->getPermissions();
    }

    /**
     * Get the user's primary role.
     */
    public function getRoleAttribute(): ?string
    {
        return $this->roles->first()?->slug;
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'user_permission');
    }

    public function hasAnyPermission(array $permissions): bool
    {
        return collect($permissions)->some(fn ($permission) => $this->hasPermission($permission));
    }

    public function hasAllPermissions(array $permissions): bool
    {
        return collect($permissions)->every(fn ($permission) => $this->hasPermission($permission));
    }

    public function grantPermission(string $permission): void
    {
        $permission = Permission::where('slug', $permission)->first();
        if ($permission && !$this->permissions->contains($permission->id)) {
            $this->permissions()->attach($permission->id);
        }
    }

    public function revokePermission(string $permission): void
    {
        $permission = Permission::where('slug', $permission)->first();
        if ($permission) {
            $this->permissions()->detach($permission->id);
        }
    }

    public function syncPermissions(array $permissions): void
    {
        $permissionIds = Permission::whereIn('slug', $permissions)->pluck('id');
        $this->permissions()->sync($permissionIds);
    }
}
