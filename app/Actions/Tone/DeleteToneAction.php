<?php

namespace App\Actions\Tone;

use App\Models\UserTone;

class DeleteToneAction
{
    /**
     * Delete a custom writing tone.
     */
    public function execute(UserTone $tone): bool
    {
        return $tone->delete();
    }
}
