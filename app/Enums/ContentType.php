<?php

namespace App\Enums;

enum ContentType: string
{
    case FacebookPost = 'facebook_post';
    case TikTokScript = 'tiktok_script';
    case MarketingCopy = 'marketing_copy';
    case Caption = 'caption';
    case BlogPost = 'blog_post';

    public function label(): string
    {
        return match ($this) {
            self::FacebookPost => 'Facebook Post',
            self::TikTokScript => 'TikTok Script',
            self::MarketingCopy => 'Marketing Copy',
            self::Caption => 'Caption',
            self::BlogPost => 'Blog Post',
        };
    }

    public function promptFile(): string
    {
        return match ($this) {
            self::FacebookPost => 'facebook_post.md',
            self::TikTokScript => 'tiktok_script.md',
            self::MarketingCopy => 'marketing_copy.md',
            self::Caption => 'caption.md',
            self::BlogPost => 'blog_post.md',
        };
    }
}
