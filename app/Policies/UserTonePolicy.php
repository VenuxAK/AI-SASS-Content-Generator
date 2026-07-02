<?php

namespace App\Policies;

use App\Models\User;
use App\Models\UserTone;

class UserTonePolicy
{
    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, UserTone $userTone): bool
    {
        return $user->id === $userTone->user_id;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, UserTone $userTone): bool
    {
        return $user->id === $userTone->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, UserTone $userTone): bool
    {
        return $user->id === $userTone->user_id;
    }
}
