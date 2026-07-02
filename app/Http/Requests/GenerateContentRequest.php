<?php

namespace App\Http\Requests;

use App\Enums\ContentType;
use App\Enums\OutputLanguage;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class GenerateContentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'content_type' => ['required', 'string', Rule::enum(ContentType::class)],
            'output_language' => ['required', 'string', Rule::enum(OutputLanguage::class)],
            'user_prompt' => ['required', 'string', 'max:2000'],
            'tone_id' => [
                'nullable',
                'integer',
                Rule::exists('user_tones', 'id')->where(function ($query) {
                    return $query->where('user_id', $this->user()->id);
                }),
            ],
        ];
    }
}
