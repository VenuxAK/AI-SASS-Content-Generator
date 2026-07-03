<?php

namespace App\Services;

use GuzzleHttp\Client as GuzzleClient;
use Illuminate\Support\Facades\Log;

class GeminiStreamService
{
    protected string $apiKey;

    protected string $model;

    protected int $streamTimeout;

    public function __construct()
    {
        $this->apiKey = config('services.gemini.key');
        $this->model = config('services.gemini.model', 'gemini-1.5-pro');
        $this->streamTimeout = config('services.gemini.stream_timeout', 120);
    }

    /**
     * Streams content token-by-token from Gemini API.
     *
     * @param  callable  $onChunk  Called with ($textChunk)
     * @param  callable  $onComplete  Called with ($fullText)
     */
    public function stream(string $prompt, callable $onChunk, callable $onComplete): void
    {
        $provider = env('AI_PROVIDER', 'gemini');

        if ($provider === 'openrouter') {
            $openRouterKey = config('services.openrouter.key');
            $openRouterModel = config('services.openrouter.model', 'google/gemini-2.5-flash');

            if (empty($openRouterKey)) {
                throw new \RuntimeException('OpenRouter API key is not configured.');
            }

            $client = new GuzzleClient([
                'timeout' => $this->streamTimeout,
                'connect_timeout' => 10,
            ]);

            try {
                $response = $client->post('https://openrouter.ai/api/v1/chat/completions', [
                    'headers' => [
                        'Authorization' => "Bearer {$openRouterKey}",
                        'Content-Type' => 'application/json',
                        'Accept' => 'text/event-stream',
                        'HTTP-Referer' => config('app.url', 'http://localhost:8000'),
                        'X-Title' => 'AI SaaS Content Generator',
                    ],
                    'json' => [
                        'model' => $openRouterModel,
                        'messages' => [
                            ['role' => 'user', 'content' => $prompt],
                        ],
                        'temperature' => 0.3,
                        'stream' => true,
                    ],
                    'stream' => true,
                ]);

                $body = $response->getBody();
                $buffer = '';
                $fullContent = '';

                while (! $body->eof()) {
                    $read = $body->read(1024);
                    $buffer .= $read;

                    while (($pos = strpos($buffer, "\n")) !== false) {
                        $line = substr($buffer, 0, $pos);
                        $buffer = substr($buffer, $pos + 1);
                        $line = trim($line);

                        if (empty($line)) {
                            continue;
                        }

                        if (str_starts_with($line, 'data:')) {
                            $dataJson = trim(substr($line, 5));

                            if ($dataJson === '[DONE]' || empty($dataJson)) {
                                continue;
                            }

                            $data = json_decode($dataJson, true);

                            // Check if API returned an error structure in stream
                            if ($data && isset($data['error'])) {
                                $errMsg = $data['error']['message'] ?? json_encode($data['error']);
                                throw new \RuntimeException('OpenRouter API Error: '.$errMsg);
                            }

                            if ($data && isset($data['choices'][0]['delta']['content'])) {
                                $text = $data['choices'][0]['delta']['content'];
                                $fullContent .= $text;
                                $onChunk($text);
                            }
                        }
                    }
                }

                $onComplete($fullContent);

                return;
            } catch (\Throwable $e) {
                Log::error('OpenRouter SSE streaming failed: '.$e->getMessage(), [
                    'exception' => $e,
                ]);
                throw new \RuntimeException('AI streaming content failed: '.$e->getMessage(), 0, $e);
            }
        }

        if (empty($this->apiKey)) {
            throw new \RuntimeException('Gemini API key is not configured.');
        }

        $url = "https://generativelanguage.googleapis.com/v1beta/models/{$this->model}:streamGenerateContent?key={$this->apiKey}&alt=sse";

        $client = new GuzzleClient([
            'timeout' => $this->streamTimeout,
            'connect_timeout' => 10,
        ]);

        $payload = [
            'contents' => [
                [
                    'parts' => [
                        ['text' => $prompt],
                    ],
                ],
            ],
        ];

        try {
            $response = $client->post($url, [
                'headers' => [
                    'Content-Type' => 'application/json',
                    'Accept' => 'text/event-stream',
                ],
                'json' => $payload,
                'stream' => true,
            ]);

            $body = $response->getBody();
            $buffer = '';
            $fullContent = '';

            while (! $body->eof()) {
                // Read a chunk of bytes
                $read = $body->read(1024);
                $buffer .= $read;

                // Split into lines
                while (($pos = strpos($buffer, "\n")) !== false) {
                    $line = substr($buffer, 0, $pos);
                    $buffer = substr($buffer, $pos + 1);
                    $line = trim($line);

                    if (empty($line)) {
                        continue;
                    }

                    if (str_starts_with($line, 'data:')) {
                        $dataJson = trim(substr($line, 5));

                        // Stop if we receive the done token or empty JSON
                        if ($dataJson === '[DONE]' || empty($dataJson)) {
                            continue;
                        }

                        $data = json_decode($dataJson, true);

                        // Check if API returned an error structure in stream
                        if ($data && isset($data['error'])) {
                            $errMsg = $data['error']['message'] ?? json_encode($data['error']);
                            throw new \RuntimeException('Gemini API Error: '.$errMsg);
                        }

                        if ($data && isset($data['candidates'][0]['content']['parts'][0]['text'])) {
                            $text = $data['candidates'][0]['content']['parts'][0]['text'];
                            $fullContent .= $text;
                            $onChunk($text);
                        }
                    }
                }
            }

            // Fire completion callback
            $onComplete($fullContent);

        } catch (\Throwable $e) {
            Log::error('Gemini SSE streaming failed: '.$e->getMessage(), [
                'exception' => $e,
            ]);
            throw new \RuntimeException('AI streaming content failed: '.$e->getMessage(), 0, $e);
        }
    }
}
