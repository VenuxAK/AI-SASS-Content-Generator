<?php

namespace App\Actions\Credit;

use App\Models\CreditTransaction;
use App\Models\User;
use App\Services\CreditService;

class AdjustCreditAction
{
    public function __construct(protected CreditService $creditService) {}

    /**
     * Adjust credits (by admin).
     */
    public function execute(User $user, int $amount, string $description): CreditTransaction
    {
        return $this->creditService->adjust($user, $amount, $description);
    }
}
