<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class BabyProfile extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'name',
        'birth_date',
        'gender',
        'birth_weight',
        'birth_height',
        'medical_notes',
        'photo_path',
    ];

    protected $casts = [
        'birth_date'=> 'date',
    ];

    public function parent(): BelongsTo{
        return $this->belongsTo(User::class, 'user_id');
    }

    public function associateDevices(){
        return $this->hasManyThrough(
            Device::class,
            'device_user', // Intermediate table
            'user_id', // Foreign key on the DeviceUser table
            'id', // Foreign key on the Device table
            'user_id', // Local key on the BabyProfile table
            'device_id' // Local key on the DeviceUser table
        );
    }
}
