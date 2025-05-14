<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('device_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('device_id')->constrained()->onDelete('cascade');
            $table->string('key');
            $table->text('value');
            $table->timestamps();
            
            $table->unique(['device_id', 'key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('device_settings');
    }
}; 