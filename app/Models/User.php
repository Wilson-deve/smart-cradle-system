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
        'role_id',
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
        ];
    }

    public function devices()
    {
        return $this->hasMany(Device::class);
    }

    public function assignedDevices()
    {
        return $this->belongsToMany(Device::class, 'device_babysitter', 'babysitter_id', 'device_id')
            ->withPivot('status')
            ->withTimestamps();
    }

    public function babysitters()
    {
        return $this->belongsToMany(User::class, 'parent_babysitter', 'parent_id', 'babysitter_id')
            ->withPivot('status')
            ->withTimestamps();
    }

    public function babyProfile()
    {
        return $this->hasOne(BabyProfile::class);
    }
    
    // Optional: Add convenience methods
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
    
    public function hasDeviceAccess(Device $device): bool
    {
        return $this->devices()->where('device_id', $device->id)->exists();
    }
    
    public function getDevicePermissions(Device $device)
    {
        $relationship = $this->devices()->where('device_id', $device->id)->first();
        return $relationship ? json_decode($relationship->pivot->permissions, true) : [];
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

    public function hasPermission(string $permission): bool
    {
        // Check if user has the permission directly
        if ($this->permissions()->where('slug', $permission)->exists()) {
            return true;
        }

        // Check if any of the user's roles have the permission
        return $this->roles()
            ->whereHas('permissions', function ($query) use ($permission) {
                $query->where('slug', $permission);
            })
            ->exists();
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
