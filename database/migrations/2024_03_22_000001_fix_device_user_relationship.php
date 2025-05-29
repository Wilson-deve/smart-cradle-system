<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Drop user_id from devices table if it exists
        if (Schema::hasColumn('devices', 'user_id')) {
            Schema::table('devices', function (Blueprint $table) {
                $table->dropForeign(['user_id']);
                $table->dropColumn('user_id');
            });
        }

        // Ensure device_user table exists with correct structure
        if (!Schema::hasTable('device_user')) {
            Schema::create('device_user', function (Blueprint $table) {
                $table->id();
                $table->foreignId('device_id')->constrained()->onDelete('cascade');
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->string('relationship_type'); // owner, caretaker, viewer
                $table->json('permissions')->nullable();
                $table->timestamps();

                $table->unique(['device_id', 'user_id']);
            });
        }
    }

    public function down()
    {
        // No need to revert as this is a fixing migration
    }
}; 