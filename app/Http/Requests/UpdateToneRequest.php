<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateToneRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Handled by Policy
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $tone = $this->route('tone');
        $toneId = $tone ? $tone->id : null;

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('user_tones')->where(function ($query) {
                    return $query->where('user_id', $this->user()->id);
                })->ignore($toneId),
            ],
            'description' => ['required', 'string', 'max:2000'],
        ];
    }
}
