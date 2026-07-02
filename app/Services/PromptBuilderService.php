<?php

namespace App\Services;

use App\Enums\ContentType;
use App\Enums\OutputLanguage;
use Illuminate\Support\Facades\File;

class PromptBuilderService
{
    /**
     * Build the final prompt for the AI model.
     */
    public function build(
        ContentType $contentType,
        string $userPrompt,
        ?string $toneDescription,
        OutputLanguage $language
    ): string {
        $templatePath = app_path("Prompts/{$contentType->promptFile()}");

        if (! File::exists($templatePath)) {
            throw new \InvalidArgumentException("Prompt template for {$contentType->value} does not exist at {$templatePath}");
        }

        $template = File::get($templatePath);

        // Build tone block
        $toneBlock = '';
        if ($toneDescription) {
            $toneBlock = "Writing Style Instructions (MUST follow these strictly):\n---\n".trim($toneDescription)."\n---";
        }

        // Replace placeholders
        $prompt = str_replace('{{TONE_INSTRUCTIONS}}', $toneBlock, $template);
        $prompt = str_replace('{{USER_PROMPT}}', trim($userPrompt), $prompt);
        $prompt = str_replace('{{OUTPUT_LANGUAGE_INSTRUCTION}}', $language->instruction(), $prompt);

        return trim($prompt);
    }
}
