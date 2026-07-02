import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Sparkles, Plus, Edit2, Trash2, X } from 'lucide-react';
import { index as tonesIndex, store as tonesStore, update as tonesUpdate, destroy as tonesDestroy } from '@/routes/tones';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

interface Tone {
    id: number;
    name: string;
    description: string;
    created_at: string;
}

interface TonesIndexProps {
    tones: Tone[];
}

export default function TonesIndex({ tones }: TonesIndexProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingTone, setEditingTone] = useState<Tone | null>(null);

    // Form for Creating a Tone
    const createForm = useForm({
        name: '',
        description: '',
    });

    // Form for Editing a Tone
    const editForm = useForm({
        name: '',
        description: '',
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(tonesStore.url(), {
            onSuccess: () => {
                createForm.reset();
                setIsCreateOpen(false);
            },
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTone) return;
        
        editForm.put(tonesUpdate.url({ tone: editingTone.id }), {
            onSuccess: () => {
                setEditingTone(null);
            },
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this custom writing tone? Generations using it will preserve a snapshot but the tone itself will be deleted.')) {
            router.delete(tonesDestroy.url({ tone: id }));
        }
    };

    const openEdit = (tone: Tone) => {
        setEditingTone(tone);
        editForm.setData({
            name: tone.name,
            description: tone.description,
        });
    };

    return (
        <>
            <Head title="Custom Writing Tones" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
                
                {/* Header Section */}
                <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-5">
                    <div>
                        <h1 className="text-2xl font-black text-neutral-950 dark:text-neutral-50 flex items-center gap-2">
                            <Sparkles className="size-6 text-indigo-600" />
                            Writing Tones
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            Define your unique voice, tone, and brand persona to personalize generated content.
                        </p>
                    </div>
                    {!isCreateOpen && !editingTone && (
                        <Button 
                            onClick={() => setIsCreateOpen(true)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center gap-2 cursor-pointer shadow-sm shadow-indigo-600/10 h-11"
                        >
                            <Plus className="size-4" />
                            Create Tone
                        </Button>
                    )}
                </div>

                {/* Form: Create Tone Form Card */}
                {isCreateOpen && (
                    <Card className="border-indigo-100 dark:border-indigo-950 shadow-md bg-indigo-50/10 dark:bg-indigo-950/10 rounded-2xl">
                        <CardHeader className="flex flex-row justify-between items-start pb-4">
                            <div>
                                <CardTitle className="text-md font-bold text-indigo-950 dark:text-indigo-50">Create New Writing Tone</CardTitle>
                                <CardDescription className="text-xs">Provide details about how the AI should write for this persona.</CardDescription>
                            </div>
                            <button 
                                onClick={() => setIsCreateOpen(false)}
                                className="p-1 rounded-full text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            >
                                <X className="size-4" />
                            </button>
                        </CardHeader>
                        <form onSubmit={handleCreate}>
                            <CardContent className="space-y-4">
                                <div>
                                    <label htmlFor="create_name" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                                        Tone Name
                                    </label>
                                    <input
                                        id="create_name"
                                        type="text"
                                        placeholder="e.g. Friendly Tech Startup, Professional Lawyer, Gen-Z Casual"
                                        value={createForm.data.name}
                                        onChange={(e) => createForm.setData('name', e.target.value)}
                                        className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                    {createForm.errors.name && <span className="text-xs text-rose-500 mt-1 block">{createForm.errors.name}</span>}
                                </div>
                                <div>
                                    <label htmlFor="create_description" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                                        Description / Rules
                                    </label>
                                    <textarea
                                        id="create_description"
                                        rows={4}
                                        placeholder="Describe the style. e.g. 'Use a friendly and informal voice. Use contractions. Use plenty of metaphors and tech-related puns. Add 2-3 emojis per paragraph. Avoid complex legal jargon.'"
                                        value={createForm.data.description}
                                        onChange={(e) => createForm.setData('description', e.target.value)}
                                        className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                        required
                                    />
                                    {createForm.errors.description && <span className="text-xs text-rose-500 mt-1 block">{createForm.errors.description}</span>}
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-3 pt-2">
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={() => setIsCreateOpen(false)}
                                    className="rounded-xl border border-neutral-200 dark:border-neutral-800 cursor-pointer"
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={createForm.processing}
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold cursor-pointer"
                                >
                                    {createForm.processing ? 'Creating...' : 'Create Persona'}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                )}

                {/* Form: Edit Tone Form Card */}
                {editingTone && (
                    <Card className="border-amber-100 dark:border-amber-950 shadow-md bg-amber-50/10 dark:bg-amber-950/10 rounded-2xl">
                        <CardHeader className="flex flex-row justify-between items-start pb-4">
                            <div>
                                <CardTitle className="text-md font-bold text-amber-950 dark:text-amber-50">Edit Writing Tone</CardTitle>
                                <CardDescription className="text-xs">Update voice details for "{editingTone.name}".</CardDescription>
                            </div>
                            <button 
                                onClick={() => setEditingTone(null)}
                                className="p-1 rounded-full text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            >
                                <X className="size-4" />
                            </button>
                        </CardHeader>
                        <form onSubmit={handleUpdate}>
                            <CardContent className="space-y-4">
                                <div>
                                    <label htmlFor="edit_name" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                                        Tone Name
                                    </label>
                                    <input
                                        id="edit_name"
                                        type="text"
                                        value={editForm.data.name}
                                        onChange={(e) => editForm.setData('name', e.target.value)}
                                        className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                    {editForm.errors.name && <span className="text-xs text-rose-500 mt-1 block">{editForm.errors.name}</span>}
                                </div>
                                <div>
                                    <label htmlFor="edit_description" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                                        Description / Rules
                                    </label>
                                    <textarea
                                        id="edit_description"
                                        rows={4}
                                        value={editForm.data.description}
                                        onChange={(e) => editForm.setData('description', e.target.value)}
                                        className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                        required
                                    />
                                    {editForm.errors.description && <span className="text-xs text-rose-500 mt-1 block">{editForm.errors.description}</span>}
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-3 pt-2">
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={() => setEditingTone(null)}
                                    className="rounded-xl border border-neutral-200 dark:border-neutral-800 cursor-pointer"
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={editForm.processing}
                                    className="bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold cursor-pointer"
                                >
                                    {editForm.processing ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                )}

                {/* Tone Cards Grid */}
                {tones.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {tones.map((tone) => (
                            <Card key={tone.id} className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between overflow-hidden">
                                <CardHeader className="pb-3 bg-neutral-50/50 dark:bg-neutral-950/20 border-b border-neutral-100 dark:border-neutral-800/60">
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-sm font-extrabold text-neutral-900 dark:text-neutral-50">{tone.name}</CardTitle>
                                        <div className="flex items-center gap-1.5">
                                            <button 
                                                onClick={() => openEdit(tone)}
                                                className="p-1.5 rounded-lg text-neutral-500 hover:text-indigo-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                                                title="Edit tone"
                                            >
                                                <Edit2 className="size-3.5" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(tone.id)}
                                                className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                                                title="Delete tone"
                                            >
                                                <Trash2 className="size-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4 pb-5 flex-1">
                                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed whitespace-pre-line">
                                        {tone.description}
                                    </p>
                                </CardContent>
                                <CardFooter className="py-2.5 px-4 bg-neutral-50/30 dark:bg-neutral-950/10 border-t border-neutral-100 dark:border-neutral-800/40 text-[10px] text-neutral-400">
                                    Created on {new Date(tone.created_at).toLocaleDateString()}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="border border-dashed border-neutral-200 dark:border-neutral-800 rounded-3xl p-12 text-center max-w-md mx-auto my-6 w-full bg-neutral-50/30 dark:bg-neutral-900/10">
                        <Sparkles className="size-10 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
                        <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-50">Define your first tone</h3>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 mb-6">
                            Customize how the AI talks to match your voice or your brand identity perfectly.
                        </p>
                        <Button 
                            onClick={() => setIsCreateOpen(true)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold cursor-pointer"
                        >
                            Create Voice Tone
                        </Button>
                    </div>
                )}

            </div>
        </>
    );
}

TonesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Writing Tones',
            href: tonesIndex.url(),
        },
    ],
};
