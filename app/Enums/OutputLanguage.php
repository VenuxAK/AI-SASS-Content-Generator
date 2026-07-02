<?php

namespace App\Enums;

enum OutputLanguage: string
{
    case English = 'en';
    case Burmese = 'my';

    public function label(): string
    {
        return match ($this) {
            self::English => 'English',
            self::Burmese => 'Burmese (Myanmar)',
        };
    }

    public function instruction(): string
    {
        return match ($this) {
            self::English => 'Write the entire content in English.',
            self::Burmese => 'Write the entire content in Burmese (Myanmar language, Unicode script).',
        };
    }
}
