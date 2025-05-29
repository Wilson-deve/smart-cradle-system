<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('alerts', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->after('device_id')->constrained()->onDelete('cascade');
            $table->index(['user_id', 'status', 'created_at']);
        });
    }

    public function down()
    {
        Schema::table('alerts', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
            $table->dropIndex(['user_id', 'status', 'created_at']);
        });
    }
}; 