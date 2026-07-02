import { Head, Link } from '@inertiajs/react';
import { ShieldCheck, Receipt, Wallet, User } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { index as adminTransactionsIndex } from '@/routes/admin/transactions';
import { show as adminUsersShow } from '@/routes/admin/users';

interface TransactionUser {
    id: number;
    name: string;
    email: string;
}

interface Transaction {
    id: number;
    type: 'purchase' | 'consumption' | 'adjustment' | 'refund';
    amount: number;
    balance_before: number;
    balance_after: number;
    description: string;
    created_at: string;
    user: TransactionUser;
}

interface TransactionsProps {
    transactions: {
        data: Transaction[];
        links: any[];
        total: number;
        current_page: number;
        last_page: number;
    };
}

export default function AdminTransactions({ transactions }: TransactionsProps) {
    return (
        <>
            <Head title="Global Billing Ledger" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
                
                {/* Header Section */}
                <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-5">
                    <div>
                        <h1 className="text-2xl font-black text-neutral-950 dark:text-neutral-50 flex items-center gap-2">
                            <ShieldCheck className="size-6 text-indigo-600" />
                            Admin Console: Global Ledger
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            Auditable append-only transaction ledger for all system wallets and packages.
                        </p>
                    </div>
                </div>

                {/* Ledger Card */}
                <Card className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold text-neutral-900 dark:text-neutral-50">Global Credit Ledger History ({transactions.total} records)</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {transactions.data.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-neutral-50 dark:bg-neutral-950 text-neutral-500 dark:text-neutral-400 border-b border-neutral-100 dark:border-neutral-800">
                                        <tr>
                                            <th className="p-4 font-bold text-xs">Date</th>
                                            <th className="p-4 font-bold text-xs">User</th>
                                            <th className="p-4 font-bold text-xs">Type</th>
                                            <th className="p-4 font-bold text-xs">Adjustment</th>
                                            <th className="p-4 font-bold text-xs">Wallet (Before/After)</th>
                                            <th className="p-4 font-bold text-xs">Reason Description</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                                        {transactions.data.map((tx) => {
                                            const isPositive = tx.amount > 0;
                                            
                                            // Badges
                                            const typeBadge = {
                                                purchase: <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-950/30">Purchase</Badge>,
                                                consumption: <Badge className="bg-neutral-100 text-neutral-700 dark:bg-neutral-850 dark:text-neutral-350 border border-neutral-205 dark:border-neutral-850">Generation</Badge>,
                                                adjustment: <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 border border-blue-100 dark:border-blue-950/30">Adjustment</Badge>,
                                                refund: <Badge className="bg-purple-50 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400 border border-purple-100 dark:border-purple-950/30">Refund</Badge>,
                                            }[tx.type];

                                            return (
                                                <tr key={tx.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-950/10 transition">
                                                    <td className="p-4 text-xs whitespace-nowrap text-neutral-500 dark:text-neutral-400">
                                                        {new Date(tx.created_at).toLocaleString()}
                                                    </td>
                                                    <td className="p-4">
                                                        <Link
                                                            href={adminUsersShow.url(tx.user.id)}
                                                            className="flex flex-col hover:underline text-left group"
                                                        >
                                                            <span className="text-xs font-bold text-neutral-900 dark:text-neutral-250 group-hover:text-indigo-600">
                                                                {tx.user.name}
                                                            </span>
                                                            <span className="text-[10px] text-neutral-400">
                                                                {tx.user.email}
                                                            </span>
                                                        </Link>
                                                    </td>
                                                    <td className="p-4">
                                                        {typeBadge}
                                                    </td>
                                                    <td className={`p-4 font-bold text-xs ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                                        {isPositive ? `+${tx.amount}` : tx.amount}
                                                    </td>
                                                    <td className="p-4 text-xs text-neutral-600 dark:text-neutral-400">
                                                        {tx.balance_before} → <span className="font-bold text-neutral-900 dark:text-neutral-200">{tx.balance_after}</span>
                                                    </td>
                                                    <td className="p-4 text-xs text-neutral-600 dark:text-neutral-400 max-w-[240px] truncate" title={tx.description}>
                                                        {tx.description}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="py-12 text-center text-neutral-400">
                                <Receipt className="size-8 text-neutral-300 mx-auto mb-2" />
                                <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-50">No ledger adjustments recorded</h3>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pagination */}
                {transactions.last_page > 1 && (
                    <div className="flex justify-center gap-1.5 mt-2">
                        {transactions.links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url || '#'}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
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

            </div>
        </>
    );
}

AdminTransactions.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Admin Ledger',
            href: adminTransactionsIndex.url(),
        },
    ],
};
