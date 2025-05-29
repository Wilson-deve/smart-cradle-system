<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('babysitter_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('phone');
            $table->integer('experience_years');
            $table->json('certifications');
            $table->json('availability');
            $table->enum('status', ['active', 'inactive', 'on_leave'])->default('active');
            $table->text('bio')->nullable();
            $table->string('profile_photo')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('babysitter_profiles');
    }
}; 