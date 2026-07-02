<?php

namespace App\Http\Controllers;

use App\Actions\Content\DeleteGenerationAction;
use App\Actions\Content\GenerateContentAction;
use App\Http\Requests\GenerateContentRequest;
use App\Models\Generation;
use App\Services\ContentHistoryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class GenerationController extends Controller
{
    public function __construct(
        protected ContentHistoryService $historyService
    ) {}

    /**
     * Display a listing of past content generations.
     */
    public function index(Request $request): Response
    {
        $history = $this->historyService->getHistory($request->user(), 10);

        return Inertia::render('History/Index', [
            'history' => $history,
        ]);
    }

    /**
     * Store a newly initiated pending generation and redirect to detail page.
     */
    public function store(GenerateContentRequest $request, GenerateContentAction $action): RedirectResponse
    {
        $generation = $action->execute($request->user(), $request->validated());

        // Redirect to detail page with autostream flag
        return to_route('history.show', $generation->id)->with('autostream', true);
    }

    /**
     * Display the detail of a content generation.
     */
    public function show(Request $request, Generation $generation): Response
    {
        Gate::authorize('view', $generation);

        // Retrieve flash autostream flag
        $autostream = $request->session()->get('autostream', false);

        return Inertia::render('History/Show', [
            'generation' => $generation->load('tone'),
            'autostream' => $autostream,
        ]);
    }

    /**
     * Update the generated content.
     */
    public function update(Request $request, Generation $generation): RedirectResponse
    {
        Gate::authorize('update', $generation);

        $validated = $request->validate([
            'edited_content' => ['nullable', 'string'],
        ]);

        $generation->update([
            'edited_content' => $validated['edited_content'],
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Generated content saved successfully.',
        ]);

        return back();
    }

    /**
     * Delete the generation record.
     */
    public function destroy(Generation $generation, DeleteGenerationAction $action): RedirectResponse
    {
        Gate::authorize('delete', $generation);

        $action->execute($generation);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Generation record deleted successfully.',
        ]);

        return to_route('history.index');
    }
}
