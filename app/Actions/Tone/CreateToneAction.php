<?php

namespace App\Actions\Tone;

use App\Models\User;
use App\Models\UserTone;

class CreateToneAction
{
    /**
     * Create a new custom writing tone for the user.
     */
    public function execute(User $user, array $data): UserTone
    {
        $tone = new UserTone;
        $tone->user_id = $user->id;
        $tone->name = $data['name'];
        $tone->description = $data['description'];
        $tone->save();

        return $tone;
    }
}
