<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('device_telemetry', function (Blueprint $table) {
            $table->id();
            $table->foreignId('device_id')->constrained()->onDelete('cascade');
            $table->decimal('temperature', 5, 2)->nullable();
            $table->decimal('humidity', 5, 2)->nullable();
            $table->decimal('sound_level', 5, 2)->nullable();
            $table->decimal('motion_level', 5, 2)->nullable();
            $table->decimal('light_level', 5, 2)->nullable();
            $table->decimal('battery_level', 5, 2)->nullable();
            $table->json('additional_data')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('device_telemetry');
    }
}; 