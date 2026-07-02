<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiService
{
    protected string $apiKey;

    protected string $model;

    protected int $timeout;

    public function __construct()
    {
        $this->apiKey = config('services.gemini.key');
        $this->model = config('services.gemini.model', 'gemini-1.5-pro');
        $this->timeout = config('services.gemini.timeout', 30);
    }

    public function generate(string $prompt): string
    {
        $provider = env('AI_PROVIDER', 'gemini');

        if ($provider === 'openrouter') {
            $openRouterKey = config('services.openrouter.key');
            $openRouterModel = config('services.openrouter.model', 'google/gemini-2.5-flash');

            if (empty($openRouterKey)) {
                throw new \RuntimeException('OpenRouter API key is not configured.');
            }

            try {
                $response = Http::timeout($this->timeout)
                    ->withHeaders([
                        'Authorization' => "Bearer {$openRouterKey}",
                        'Content-Type' => 'application/json',
                        'HTTP-Referer' => config('app.url', 'http://localhost:8000'),
                        'X-Title' => 'AI SaaS Content Generator',
                    ])
                    ->post('https://openrouter.ai/api/v1/chat/completions', [
                        'model' => $openRouterModel,
                        'messages' => [
                            ['role' => 'user', 'content' => $prompt],
                        ],
                        'temperature' => 0.3,
                    ]);

                if ($response->failed()) {
                    Log::error('OpenRouter API error: '.$response->body());
                    throw new \RuntimeException('OpenRouter API request failed: '.$response->status());
                }

                $data = $response->json();
                $text = $data['choices'][0]['message']['content'] ?? '';

                if (empty($text)) {
                    throw new \RuntimeException('Empty content returned from OpenRouter API.');
                }

                return $text;
            } catch (\Throwable $e) {
                Log::error('OpenRouter API invocation failed: '.$e->getMessage());
                throw $e;
            }
        }

        if (empty($this->apiKey)) {
            throw new \RuntimeException('Gemini API key is not configured.');
        }

        $url = "https://generativelanguage.googleapis.com/v1beta/models/{$this->model}:generateContent?key={$this->apiKey}";

        try {
            $response = Http::timeout($this->timeout)
                ->withHeaders(['Content-Type' => 'application/json'])
                ->post($url, [
                    'contents' => [
                        [
                            'parts' => [
                                ['text' => $prompt],
                            ],
                        ],
                    ],
                ]);

            if ($response->failed()) {
                Log::error('Gemini API error: '.$response->body());
                throw new \RuntimeException('Gemini API request failed: '.$response->status().' '.$response->reason());
            }

            $data = $response->json();
            $text = $data['candidates'][0]['content']['parts'][0]['text'] ?? '';

            if (empty($text)) {
                Log::warning('Gemini response is empty: '.json_encode($data));
                throw new \RuntimeException('Empty content returned from Gemini API.');
            }

            return $text;
        } catch (\Throwable $e) {
            Log::error('Gemini API invocation failed: '.$e->getMessage());
            throw $e;
        }
    }
}
