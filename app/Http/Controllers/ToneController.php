<?php

namespace App\Http\Controllers;

use App\Actions\Tone\CreateToneAction;
use App\Actions\Tone\DeleteToneAction;
use App\Actions\Tone\UpdateToneAction;
use App\Http\Requests\StoreToneRequest;
use App\Http\Requests\UpdateToneRequest;
use App\Models\UserTone;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ToneController extends Controller
{
    /**
     * Display a listing of custom tones.
     */
    public function index(Request $request): Response
    {
        $tones = $request->user()->tones()->orderBy('name')->get();

        return Inertia::render('Tones/Index', [
            'tones' => $tones,
        ]);
    }

    /**
     * Store a newly created custom tone.
     */
    public function store(StoreToneRequest $request, CreateToneAction $action): RedirectResponse
    {
        $action->execute($request->user(), $request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Custom writing tone created successfully.',
        ]);

        return to_route('tones.index');
    }

    /**
     * Update the specified custom tone.
     */
    public function update(UpdateToneRequest $request, UserTone $tone, UpdateToneAction $action): RedirectResponse
    {
        Gate::authorize('update', $tone);

        $action->execute($tone, $request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Custom writing tone updated successfully.',
        ]);

        return to_route('tones.index');
    }

    /**
     * Remove the specified custom tone from storage.
     */
    public function destroy(Request $request, UserTone $tone, DeleteToneAction $action): RedirectResponse
    {
        Gate::authorize('delete', $tone);

        $action->execute($tone);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Custom writing tone deleted successfully.',
        ]);

        return to_route('tones.index');
    }
}
