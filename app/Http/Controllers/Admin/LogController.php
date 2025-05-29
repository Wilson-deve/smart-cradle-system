<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class LogController extends Controller
{
    public function index()
    {
        // Get system logs with pagination
        $logs = $this->getSystemLogs();

        return Inertia::render('Admin/Logs', [
            'logs' => $logs,
        ]);
    }

    public function download()
    {
        // Generate log file for download
        $logContent = $this->getSystemLogs(false);
        $filename = 'system-logs-' . now()->format('Y-m-d') . '.log';
        
        return response()->streamDownload(function () use ($logContent) {
            echo json_encode($logContent, JSON_PRETTY_PRINT);
        }, $filename);
    }

    private function getSystemLogs($paginate = true)
    {
        try {
            // Get logs from storage/logs
            $files = Storage::disk('logs')->files();
            $logs = [];

            foreach ($files as $file) {
                if (str_ends_with($file, '.log')) {
                    $content = Storage::disk('logs')->get($file);
                    // Parse log content and add to array
                    $logs = array_merge($logs, $this->parseLogFile($content));
                }
            }

            // Sort logs by date descending
            usort($logs, function ($a, $b) {
                return strtotime($b['timestamp']) - strtotime($a['timestamp']);
            });

            if ($paginate) {
                // Manual pagination
                $page = request()->get('page', 1);
                $perPage = 50;
                $total = count($logs);
                $logs = array_slice($logs, ($page - 1) * $perPage, $perPage);

                return [
                    'data' => $logs,
                    'total' => $total,
                    'per_page' => $perPage,
                    'current_page' => $page,
                ];
            }

            return $logs;
        } catch (\Exception $e) {
            Log::error('Error reading system logs: ' . $e->getMessage());
            return [];
        }
    }

    private function parseLogFile($content)
    {
        $pattern = '/\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\] (\w+)\.(\w+): (.*?)(?=\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\]|$)/s';
        preg_match_all($pattern, $content, $matches, PREG_SET_ORDER);

        $logs = [];
        foreach ($matches as $match) {
            $logs[] = [
                'timestamp' => $match[1],
                'level' => $match[2],
                'channel' => $match[3],
                'message' => trim($match[4]),
            ];
        }

        return $logs;
    }
} 