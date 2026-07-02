import { useState, useEffect } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { ArrowLeft, Copy, Check, Edit3, Trash2, Languages, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { index as historyIndex, update as historyUpdate, destroy as historyDestroy } from '@/routes/history';
import { stream as generateStream } from '@/routes/generate';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Tone {
    id: number;
    name: string;
}

interface Generation {
    id: number;
    content_type: string;
    output_language: string;
    user_prompt: string;
    tone_snapshot: string | null;
    full_prompt: string;
    ai_content: string | null;
    edited_content: string | null;
    status: 'pending' | 'streaming' | 'completed' | 'failed';
    created_at: string;
    credits_used: number;
    tone?: Tone | null;
}

interface ShowProps {
    generation: Generation;
    autostream: boolean;
}

export default function HistoryShow({ generation, autostream }: ShowProps) {
    const [status, setStatus] = useState<string>(generation.status);
    const [content, setContent] = useState<string>(generation.ai_content || '');
    const [error, setError] = useState<string | null>(null);
    const [isCopied, setIsCopied] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Edit form
    const editForm = useForm({
        edited_content: generation.edited_content || generation.ai_content || '',
    });

    useEffect(() => {
        // SSE Streaming Hook
        if (autostream && status === 'pending') {
            const streamUrl = generateStream.url({ generation: generation.id });
            const source = new EventSource(streamUrl);

            setStatus('streaming');

            source.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.token) {
                    setContent((prev) => prev + data.token);
                }
                if (data.done) {
                    setStatus('completed');
                    source.close();
                    toast.success('AI generation finished!');
                }
                if (data.error) {
                    setError(data.error);
                    setStatus('failed');
                    source.close();
                    toast.error(data.error);
                }
            };

            source.onerror = () => {
                source.close();
                setError('Connection lost. The stream was interrupted.');
                setStatus('failed');
                toast.error('Connection lost. Credit has been refunded.');
            };

            return () => {
                source.close();
            };
        }
    }, [autostream, generation.id]);

    // Handle copying to clipboard
    const handleCopy = () => {
        const textToCopy = generation.edited_content || content;
        if (!textToCopy) return;

        navigator.clipboard.writeText(textToCopy).then(() => {
            setIsCopied(true);
            toast.success('Copy saved to clipboard!');
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    // Save inline edits
    const handleSaveEdit = (e: React.FormEvent) => {
        e.preventDefault();
        editForm.put(historyUpdate.url({ generation: generation.id }), {
            onSuccess: () => {
                setIsEditing(false);
                toast.success('Changes saved!');
            },
        });
    };

    // Delete generation
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this generation from your history?')) {
            router.delete(historyDestroy.url({ generation: generation.id }));
        }
    };

    const activeText = generation.edited_content || content;

    // Badges for status
    const statusBadge = {
        pending: <Badge className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950/20 dark:text-yellow-400 border border-yellow-100 dark:border-yellow-950/30 animate-pulse">Pending</Badge>,
        streaming: <Badge className="bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-950/30 animate-pulse flex items-center gap-1.5"><RefreshCw className="size-3 animate-spin" /> Writing Copy...</Badge>,
        completed: <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-950/30">Completed</Badge>,
        failed: <Badge className="bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-100 dark:border-rose-950/30">Refunded / Failed</Badge>,
    }[status] || <Badge>{status}</Badge>;

    return (
        <>
            <Head title="Content Generation Detail" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 max-w-7xl mx-auto w-full">

                {/* Header Section */}
                <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-5">
                    <div>
                        <Link
                            href={historyIndex.url()}
                            className="text-xs font-bold text-neutral-500 hover:text-neutral-800 flex items-center gap-1 mb-2"
                        >
                            <ArrowLeft className="size-3" />
                            Back to History
                        </Link>
                        <h1 className="text-2xl font-black text-neutral-950 dark:text-neutral-50 flex items-center gap-2 capitalize">
                            {generation.content_type.replace('_', ' ')}
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            Generated on {new Date(generation.created_at).toLocaleString()}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {status === 'completed' && (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={handleCopy}
                                    className="rounded-xl border border-neutral-200 dark:border-neutral-800 h-10 flex items-center gap-1.5 cursor-pointer"
                                >
                                    {isCopied ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
                                    {isCopied ? 'Copied' : 'Copy Content'}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setIsEditing(!isEditing);
                                        editForm.setData('edited_content', activeText || '');
                                    }}
                                    className="rounded-xl border border-neutral-200 dark:border-neutral-800 h-10 flex items-center gap-1.5 cursor-pointer text-neutral-700 dark:text-neutral-300"
                                >
                                    <Edit3 className="size-4" />
                                    {isEditing ? 'View Copy' : 'Edit Copy'}
                                </Button>
                            </>
                        )}
                        <Button
                            variant="outline"
                            onClick={handleDelete}
                            className="rounded-xl border border-rose-100 hover:bg-rose-50 text-rose-600 dark:border-rose-950 dark:hover:bg-rose-950/20 dark:text-rose-400 h-10 flex items-center gap-1.5 cursor-pointer"
                        >
                            <Trash2 className="size-4" />
                            Delete
                        </Button>
                    </div>
                </div>

                {/* Status and Configuration Metadata */}
                <div className="grid gap-4 md:grid-cols-4">
                    <div className="p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Status</span>
                        <div className="mt-1.5">{statusBadge}</div>
                    </div>
                    <div className="p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Language</span>
                        <div className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase">
                            <Languages className="size-4 text-indigo-600" />
                            {generation.output_language}
                        </div>
                    </div>
                    <div className="p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Writing Tone</span>
                        <div className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-neutral-900 dark:text-neutral-100">
                            <Sparkles className="size-4 text-indigo-600" />
                            {generation.tone_snapshot ? generation.tone_snapshot.split(':')[0] : 'None (Standard)'}
                        </div>
                    </div>
                    <div className="p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Credits Spent</span>
                        <div className="mt-1.5 text-xs font-black text-neutral-900 dark:text-neutral-100">
                            {generation.credits_used} Credit
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">

                    {/* Primary Text Content Viewer / Editor */}
                    <div className="lg:col-span-2 space-y-6">
                        {status === 'failed' && (
                            <Card className="border-rose-100 dark:border-rose-950/60 bg-rose-50/20 dark:bg-rose-950/10 rounded-2xl p-6">
                                <div className="flex gap-3">
                                    <AlertCircle className="size-6 text-rose-600 dark:text-rose-400 shrink-0" />
                                    <div>
                                        <h3 className="text-sm font-bold text-rose-950 dark:text-rose-400">Generation Stream Failed</h3>
                                        <p className="text-xs text-rose-800 dark:text-rose-400/80 mt-1">
                                            {error || 'The connection to the AI generation provider was lost. Your credit has been automatically refunded to your balance.'}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        )}

                        <Card className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden min-h-[300px] flex flex-col justify-between">
                            <CardHeader className="bg-neutral-50/50 dark:bg-neutral-950/20 py-4 px-6 border-b border-neutral-100 dark:border-neutral-850/60 flex flex-row items-center justify-between">
                                <CardTitle className="text-sm font-bold text-neutral-950 dark:text-neutral-50">
                                    {isEditing ? 'Edit Content' : 'AI Output'}
                                </CardTitle>
                                {generation.edited_content && !isEditing && (
                                    <Badge className="bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-100 dark:border-amber-950/30">
                                        Edited Version
                                    </Badge>
                                )}
                            </CardHeader>
                            <CardContent className="p-6 flex-1">
                                {isEditing ? (
                                    <form onSubmit={handleSaveEdit} className="space-y-4 h-full flex flex-col justify-between">
                                        <textarea
                                            value={editForm.data.edited_content}
                                            onChange={(e) => editForm.setData('edited_content', e.target.value)}
                                            rows={12}
                                            className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans leading-relaxed"
                                            required
                                        />
                                        <div className="flex justify-end gap-3 pt-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setIsEditing(false)}
                                                className="rounded-xl border border-neutral-200 dark:border-neutral-800 cursor-pointer"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={editForm.processing}
                                                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold cursor-pointer"
                                            >
                                                {editForm.processing ? 'Saving...' : 'Save Edits'}
                                            </Button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="whitespace-pre-line text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed font-sans min-h-[220px]">
                                        {activeText || (
                                            <div className="flex flex-col items-center justify-center py-12 text-neutral-400 animate-pulse">
                                                <RefreshCw className="size-6 animate-spin text-indigo-600 mb-2" />
                                                <span>Awaiting first word...</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Request Prompt Context Sidebar */}
                    <div className="space-y-6">
                        <Card className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm p-6">
                            <h3 className="text-sm font-bold text-neutral-950 dark:text-neutral-50 mb-3 border-b border-neutral-100 dark:border-neutral-800 pb-2">
                                User Input Prompt
                            </h3>
                            <p className="text-xs text-neutral-700 dark:text-neutral-350 leading-relaxed whitespace-pre-line bg-neutral-50/50 dark:bg-neutral-950/20 p-3 rounded-xl border border-neutral-100 dark:border-neutral-850/30">
                                {generation.user_prompt}
                            </p>
                        </Card>

                        {generation.tone_snapshot && (
                            <Card className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm p-6">
                                <h3 className="text-sm font-bold text-neutral-950 dark:text-neutral-50 mb-3 border-b border-neutral-100 dark:border-neutral-800 pb-2">
                                    Tone Guidelines Used
                                </h3>
                                <p className="text-xs text-neutral-700 dark:text-neutral-350 leading-relaxed whitespace-pre-line bg-neutral-50/50 dark:bg-neutral-950/20 p-3 rounded-xl border border-neutral-100 dark:border-neutral-850/30">
                                    {generation.tone_snapshot}
                                </p>
                            </Card>
                        )}
                    </div>

                </div>

            </div>
        </>
    );
}

HistoryShow.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'History',
            href: historyIndex.url(),
        },
        {
            title: 'Detail',
            href: '/history',
        },
    ],
};
