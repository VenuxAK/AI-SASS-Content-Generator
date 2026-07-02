<?php

namespace App\Actions\Content;

use App\Actions\Credit\DeductCreditAction;
use App\Enums\ContentType;
use App\Enums\OutputLanguage;
use App\Models\Generation;
use App\Models\User;
use App\Models\UserTone;
use App\Services\PromptBuilderService;
use Illuminate\Support\Facades\DB;

class GenerateContentAction
{
    public function __construct(
        protected PromptBuilderService $promptBuilder,
        protected DeductCreditAction $deductCredit
    ) {}

    /**
     * Orchestrates content validation, credit deduction, and generation database logging.
     */
    public function execute(User $user, array $data): Generation
    {
        $contentType = ContentType::from($data['content_type']);
        $language = OutputLanguage::from($data['output_language']);
        $userPrompt = $data['user_prompt'];
        $toneId = $data['tone_id'] ?? null;

        $toneDescription = null;
        $toneSnapshot = null;

        if ($toneId) {
            $tone = UserTone::where('user_id', $user->id)->findOrFail($toneId);
            $toneDescription = $tone->description;
            $toneSnapshot = $tone->name.': '.$tone->description;
        }

        $fullPrompt = $this->promptBuilder->build($contentType, $userPrompt, $toneDescription, $language);

        return DB::transaction(function () use ($user, $toneId, $contentType, $language, $userPrompt, $toneSnapshot, $fullPrompt) {
            // Deduct 1 credit
            $description = "Generation cost for {$contentType->label()}.";

            // Create generation first in pending status so we have it for transaction log
            $generation = new Generation;
            $generation->user_id = $user->id;
            $generation->tone_id = $toneId;
            $generation->content_type = $contentType;
            $generation->output_language = $language;
            $generation->user_prompt = $userPrompt;
            $generation->tone_snapshot = $toneSnapshot;
            $generation->full_prompt = $fullPrompt;
            $generation->credits_used = 1;
            $generation->status = 'pending';
            $generation->save();

            // Deduct from wallet and link to generation
            $this->deductCredit->execute($user, $description, $generation, 1);

            return $generation;
        });
    }
}
