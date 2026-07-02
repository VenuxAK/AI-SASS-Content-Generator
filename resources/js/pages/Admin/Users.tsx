import { Head, Link } from '@inertiajs/react';
import { ShieldCheck, Users, Eye, Key } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { index as adminUsersIndex, show as adminUsersShow } from '@/routes/admin/users';

interface User {
    id: number;
    name: string;
    email: string;
    credit_balance: number;
    is_admin: boolean;
    created_at: string;
}

interface UsersProps {
    users: {
        data: User[];
        links: any[];
        total: number;
        current_page: number;
        last_page: number;
    };
}

export default function AdminUsers({ users }: UsersProps) {
    return (
        <>
            <Head title="Admin Users Overview" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
                
                {/* Header Section */}
                <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-5">
                    <div>
                        <h1 className="text-2xl font-black text-neutral-950 dark:text-neutral-50 flex items-center gap-2">
                            <ShieldCheck className="size-6 text-indigo-600" />
                            Admin Console: Users
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            Monitor registered user profiles, balance allocations, and transactional histories.
                        </p>
                    </div>
                </div>

                {/* Users Table Card */}
                <Card className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold text-neutral-900 dark:text-neutral-50">Registered Users ({users.total} total)</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {users.data.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-neutral-50 dark:bg-neutral-950 text-neutral-500 dark:text-neutral-400 border-b border-neutral-100 dark:border-neutral-800">
                                        <tr>
                                            <th className="p-4 font-bold text-xs">Name</th>
                                            <th className="p-4 font-bold text-xs">Email</th>
                                            <th className="p-4 font-bold text-xs">Role</th>
                                            <th className="p-4 font-bold text-xs">Credit Balance</th>
                                            <th className="p-4 font-bold text-xs">Joined Date</th>
                                            <th className="p-4 font-bold text-xs">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                                        {users.data.map((user) => {
                                            return (
                                                <tr key={user.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-950/10 transition">
                                                    <td className="p-4 font-semibold text-neutral-900 dark:text-neutral-250">
                                                        {user.name}
                                                    </td>
                                                    <td className="p-4 text-xs text-neutral-600 dark:text-neutral-400">
                                                        {user.email}
                                                    </td>
                                                    <td className="p-4">
                                                        {user.is_admin ? (
                                                            <Badge className="bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-950/30 flex items-center gap-1 w-fit">
                                                                <Key className="size-3" />
                                                                Admin
                                                            </Badge>
                                                        ) : (
                                                            <Badge className="bg-neutral-100 text-neutral-700 dark:bg-neutral-850 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-850 w-fit">
                                                                User
                                                            </Badge>
                                                        )}
                                                    </td>
                                                    <td className="p-4 text-xs font-bold text-neutral-900 dark:text-neutral-100">
                                                        {user.credit_balance} credits
                                                    </td>
                                                    <td className="p-4 text-xs text-neutral-500 dark:text-neutral-450">
                                                        {new Date(user.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="p-4">
                                                        <Link
                                                            href={adminUsersShow.url(user.id)}
                                                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 flex items-center gap-1 font-semibold text-xs transition"
                                                        >
                                                            <Eye className="size-3.5" />
                                                            View Profile
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="py-12 text-center text-neutral-400">
                                <Users className="size-8 text-neutral-300 mx-auto mb-2" />
                                <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-50">No users found</h3>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pagination */}
                {users.last_page > 1 && (
                    <div className="flex justify-center gap-1.5 mt-2">
                        {users.links.map((link, idx) => (
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

AdminUsers.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Admin Users',
            href: adminUsersIndex.url(),
        },
    ],
};
