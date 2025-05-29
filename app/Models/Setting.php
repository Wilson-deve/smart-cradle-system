<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = ['key', 'value'];

    public static function get($key, $default = null)
    {
        $setting = self::where('key', $key)->first();
        
        if (!$setting) {
            return $default;
        }
        
        $value = json_decode($setting->value, true);
        return $value === null ? $setting->value : $value;
    }

    public static function set($key, $value)
    {
        if (is_array($value)) {
            $value = json_encode($value);
        }

        self::updateOrCreate(
            ['key' => $key],
            ['value' => $value]
        );
    }
} 