<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('sensor_readings', function (Blueprint $table) {
            // Drop existing columns
            $table->dropColumn(['type', 'value', 'unit']);
            
            // Add new columns
            $table->decimal('temperature', 5, 2)->nullable();
            $table->decimal('humidity', 5, 2)->nullable();
            $table->decimal('noise_level', 5, 2)->nullable();
            $table->boolean('movement_detected')->default(false);
            $table->boolean('wetness_detected')->default(false);
            $table->decimal('light_level', 5, 2)->nullable();
            $table->decimal('battery_level', 5, 2)->nullable();
            $table->json('additional_data')->nullable();
        });
    }

    public function down()
    {
        Schema::table('sensor_readings', function (Blueprint $table) {
            // Restore original columns
            $table->string('type');
            $table->decimal('value', 8, 2);
            $table->string('unit');
            
            // Drop new columns
            $table->dropColumn([
                'temperature',
                'humidity',
                'noise_level',
                'movement_detected',
                'wetness_detected',
                'light_level',
                'battery_level',
                'additional_data',
            ]);
        });
    }
}; 