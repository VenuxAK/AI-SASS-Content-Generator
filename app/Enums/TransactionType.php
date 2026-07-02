<?php

namespace App\Enums;

enum TransactionType: string
{
    case Purchase = 'purchase';
    case Consumption = 'consumption';
    case Adjustment = 'adjustment';
    case Refund = 'refund';

    public function label(): string
    {
        return match ($this) {
            self::Purchase => 'Purchase',
            self::Consumption => 'Generation Cost',
            self::Adjustment => 'Admin Adjustment',
            self::Refund => 'Refund',
        };
    }
}
