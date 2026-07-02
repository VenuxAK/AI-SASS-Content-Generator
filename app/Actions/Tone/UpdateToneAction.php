<?php

namespace App\Actions\Tone;

use App\Models\UserTone;

class UpdateToneAction
{
    /**
     * Update an existing custom writing tone.
     */
    public function execute(UserTone $tone, array $data): UserTone
    {
        $tone->name = $data['name'];
        $tone->description = $data['description'];
        $tone->save();

        return $tone;
    }
}
