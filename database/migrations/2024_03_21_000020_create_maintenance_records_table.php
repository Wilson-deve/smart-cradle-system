<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('maintenance_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('device_id')->constrained()->onDelete('cascade');
            $table->string('type');
            $table->text('description');
            $table->timestamp('performed_at');
            $table->foreignId('performed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('next_maintenance_due')->nullable();
            $table->string('status')->default('completed');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('maintenance_records');
    }
}; 