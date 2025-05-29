<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('device_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('device_id')->constrained()->onDelete('cascade');
            $table->foreignId('current_lullaby_id')->nullable()->constrained('lullabies')->nullOnDelete();
            $table->foreignId('current_content_id')->nullable()->constrained('projector_contents')->nullOnDelete();
            $table->boolean('is_swinging')->default(false);
            $table->integer('swing_speed')->default(1);
            $table->boolean('is_playing_music')->default(false);
            $table->integer('volume')->default(50);
            $table->boolean('is_projector_on')->default(false);
            $table->json('additional_settings')->nullable();
            $table->timestamps();

            // Add unique constraint to ensure one settings record per device
            $table->unique('device_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('device_settings');
    }
}; 