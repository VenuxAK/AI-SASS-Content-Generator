<?php

namespace App\Services;

use App\Models\Generation;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ContentHistoryService
{
    /**
     * Get user generations list with pagination.
     */
    public function getHistory(User $user, int $perPage = 10): LengthAwarePaginator
    {
        return Generation::where('user_id', $user->id)
            ->with('tone')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }
}
