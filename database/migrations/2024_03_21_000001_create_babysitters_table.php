<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('babysitters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_id')->constrained('users')->onDelete('cascade');
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone');
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamp('last_active_at')->nullable();
            $table->timestamps();
        });

        Schema::create('babysitter_device', function (Blueprint $table) {
            $table->id();
            $table->foreignId('babysitter_id')->constrained()->onDelete('cascade');
            $table->foreignId('device_id')->constrained()->onDelete('cascade');
            $table->json('permissions')->nullable();
            $table->timestamps();

            $table->unique(['babysitter_id', 'device_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('babysitter_device');
        Schema::dropIfExists('babysitters');
    }
}; 