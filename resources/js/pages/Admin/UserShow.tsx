import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Wallet, AlertCircle, Sparkles, Receipt, RefreshCw, Key } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { index as adminUsersIndex, adjustCredits as adminAdjustCredits } from '@/routes/admin/users';

interface User {
    id: number;
    name: string;
    email: string;
    credit_balance: number;
    is_admin: boolean;
    created_at: string;
}

interface Tone {
    id: number;
    name: string;
}

interface Generation {
    id: number;
    content_type: string;
    output_language: string;
    user_prompt: string;
    status: string;
    created_at: string;
    tone?: Tone | null;
}

interface Transaction {
    id: number;
    type: string;
    amount: number;
    balance_before: number;
    balance_after: number;
    description: string;
    created_at: string;
}

interface UserShowProps {
    subjectUser: User;
    generations: {
        data: Generation[];
        links: any[];
        total: number;
    };
    transactions: {
        data: Transaction[];
        links: any[];
        total: number;
    };
}

export default function AdminUserShow({ subjectUser, generations, transactions }: UserShowProps) {
    
    // Credit adjustment form
    const { data, setData, post, processing, errors, reset } = useForm({
        amount: '',
        reason: '',
    });

    const handleAdjust = (e: React.FormEvent) => {
        e.preventDefault();
        post(adminAdjustCredits.url({ user: subjectUser.id }), {
            onSuccess: () => {
                reset();
                toast.success('Credits adjusted successfully!');
            },
            onError: (err) => {
                if (err.credits) {
                    toast.error(err.credits);
                }
            }
        });
    };

    return (
        <>
            <Head title={`User Profile: ${subjectUser.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
                
                {/* Header Section */}
                <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-5">
                    <div>
                        <Link 
                            href={adminUsersIndex.url()}
                            className="text-xs font-bold text-neutral-500 hover:text-neutral-800 flex items-center gap-1 mb-2"
                        >
                            <ArrowLeft className="size-3" />
                            Back to Users
                        </Link>
                        <h1 className="text-2xl font-black text-neutral-950 dark:text-neutral-50 flex items-center gap-2">
                            User Profile: {subjectUser.name}
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            Review and adjust credit limits or inspect usage details for this profile.
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    
                    {/* User Metadata Card */}
                    <Card className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm p-6 space-y-4">
                        <h3 className="text-sm font-bold text-neutral-950 dark:text-neutral-50 border-b border-neutral-100 dark:border-neutral-800 pb-2">
                            Profile Details
                        </h3>
                        <div>
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">ID</span>
                            <span className="text-xs font-medium text-neutral-850 dark:text-neutral-200">{subjectUser.id}</span>
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Email Address</span>
                            <span className="text-xs font-medium text-neutral-850 dark:text-neutral-200">{subjectUser.email}</span>
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Role</span>
                            <div className="mt-1">
                                {subjectUser.is_admin ? (
                                    <Badge className="bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-950/30 flex items-center gap-1 w-fit">
                                        <Key className="size-3" />
                                        Admin
                                    </Badge>
                                ) : (
                                    <Badge className="bg-neutral-100 text-neutral-700 dark:bg-neutral-850 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-850 w-fit">
                                        User
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Joined On</span>
                            <span className="text-xs font-medium text-neutral-850 dark:text-neutral-200">
                                {new Date(subjectUser.created_at).toLocaleString()}
                            </span>
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Wallet Balance</span>
                            <span className="text-lg font-black text-indigo-600 dark:text-indigo-400 block mt-0.5">
                                {subjectUser.credit_balance} Credits
                            </span>
                        </div>
                    </Card>

                    {/* Manual Adjustment Card */}
                    <Card className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm p-6 md:col-span-2">
                        <h3 className="text-sm font-bold text-neutral-950 dark:text-neutral-50 mb-4 border-b border-neutral-100 dark:border-neutral-800 pb-2 flex items-center gap-1.5">
                            <Wallet className="size-4 text-indigo-600" />
                            Manual Credit Adjustment
                        </h3>

                        <form onSubmit={handleAdjust} className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="amount" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                                        Credit Adjustment Amount
                                    </label>
                                    <input
                                        id="amount"
                                        type="number"
                                        placeholder="e.g. 50 or -10"
                                        value={data.amount}
                                        onChange={(e) => setData('amount', e.target.value)}
                                        className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                    {errors.amount && <span className="text-xs text-rose-500 mt-1 block">{errors.amount}</span>}
                                    <span className="text-[10px] text-neutral-400 mt-1.5 block">Use positive numbers to add credits, negative to deduct.</span>
                                </div>

                                <div>
                                    <label htmlFor="reason" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                                        Adjustment Reason Notes
                                    </label>
                                    <input
                                        id="reason"
                                        type="text"
                                        placeholder="e.g. Special promo, system refund, override"
                                        value={data.reason}
                                        onChange={(e) => setData('reason', e.target.value)}
                                        className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                    {errors.reason && <span className="text-xs text-rose-500 mt-1 block">{errors.reason}</span>}
                                </div>
                            </div>

                            <Button 
                                type="submit" 
                                disabled={processing}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold cursor-pointer h-10 w-fit px-6 flex items-center justify-center gap-1.5"
                            >
                                <RefreshCw className="size-4" />
                                Apply Adjustment
                            </Button>
                        </form>
                    </Card>

                </div>

                {/* Split History & Ledger Section */}
                <div className="grid gap-6 lg:grid-cols-2">
                    
                    {/* Generations Table */}
                    <Card className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden flex flex-col justify-between">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold text-neutral-900 dark:text-neutral-50 flex items-center gap-1.5">
                                <Sparkles className="size-4 text-indigo-600" />
                                Generation Logs ({generations.total})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 flex-1">
                            {generations.data.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                                            {generations.data.map((gen) => (
                                                <tr key={gen.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-950/10">
                                                    <td className="p-3 text-xs whitespace-nowrap text-neutral-450">
                                                        {new Date(gen.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="p-3 text-xs font-bold text-indigo-600 capitalize">
                                                        {gen.content_type.replace('_', ' ')}
                                                    </td>
                                                    <td className="p-3 text-xs text-neutral-600 dark:text-neutral-400 max-w-[200px] truncate">
                                                        {gen.user_prompt}
                                                    </td>
                                                    <td className="p-3 text-xs">
                                                        <Badge className="bg-neutral-100 text-neutral-600 capitalize">{gen.status}</Badge>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="py-8 text-center text-neutral-400 text-xs">No copy generated yet.</div>
                            )}
                        </CardContent>
                        {generations.links.length > 3 && (
                            <div className="flex justify-center gap-1 py-3 border-t border-neutral-100 dark:border-neutral-800">
                                {generations.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        className={`px-2 py-1 rounded text-[10px] font-semibold border transition ${
                                            link.active
                                                ? 'bg-indigo-600 border-indigo-600 text-white'
                                                : link.url
                                                ? 'bg-white hover:bg-neutral-50 border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300'
                                                : 'text-neutral-400 border-neutral-100 dark:border-neutral-900 pointer-events-none'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </Card>

                    {/* Ledger Transactions */}
                    <Card className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden flex flex-col justify-between">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold text-neutral-900 dark:text-neutral-50 flex items-center gap-1.5">
                                <Receipt className="size-4 text-indigo-600" />
                                Balance Ledger Logs ({transactions.total})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 flex-1">
                            {transactions.data.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                                            {transactions.data.map((tx) => {
                                                const isPositive = tx.amount > 0;
                                                return (
                                                    <tr key={tx.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-950/10">
                                                        <td className="p-3 text-[10px] text-neutral-450 whitespace-nowrap">
                                                            {new Date(tx.created_at).toLocaleDateString()}
                                                        </td>
                                                        <td className="p-3 text-xs capitalize font-semibold text-neutral-500">
                                                            {tx.type}
                                                        </td>
                                                        <td className={`p-3 text-xs font-bold ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                                            {isPositive ? `+${tx.amount}` : tx.amount}
                                                        </td>
                                                        <td className="p-3 text-xs text-neutral-500 max-w-[160px] truncate" title={tx.description}>
                                                            {tx.description}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="py-8 text-center text-neutral-400 text-xs">No transactions recorded.</div>
                            )}
                        </CardContent>
                        {transactions.links.length > 3 && (
                            <div className="flex justify-center gap-1 py-3 border-t border-neutral-100 dark:border-neutral-800">
                                {transactions.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        className={`px-2 py-1 rounded text-[10px] font-semibold border transition ${
                                            link.active
                                                ? 'bg-indigo-600 border-indigo-600 text-white'
                                                : link.url
                                                ? 'bg-white hover:bg-neutral-50 border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300'
                                                : 'text-neutral-400 border-neutral-100 dark:border-neutral-900 pointer-events-none'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </Card>

                </div>

            </div>
        </>
    );
}

AdminUserShow.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Admin Users',
            href: '/admin/users',
        },
        {
            title: 'User Profile',
            href: '/admin/users',
        },
    ],
};
