<?php

namespace App\Policies;

use App\Models\Generation;
use App\Models\User;

class GenerationPolicy
{
    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Generation $generation): bool
    {
        return $user->id === $generation->user_id;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Generation $generation): bool
    {
        return $user->id === $generation->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Generation $generation): bool
    {
        return $user->id === $generation->user_id;
    }
}
