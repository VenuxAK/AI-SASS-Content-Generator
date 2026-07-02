<?php

namespace App\Actions\Content;

use App\Models\Generation;

class DeleteGenerationAction
{
    /**
     * Delete content generation.
     */
    public function execute(Generation $generation): bool
    {
        return $generation->delete();
    }
}
