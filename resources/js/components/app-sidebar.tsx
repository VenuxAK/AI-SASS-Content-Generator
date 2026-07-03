import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, History, Sparkles, CreditCard, Users, Settings, PenTool } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as tonesIndex } from '@/routes/tones';
import { index as historyIndex } from '@/routes/history';
import { index as billingIndex } from '@/routes/billing';
import { index as adminUsersIndex } from '@/routes/admin/users';
import { index as adminTransactionsIndex } from '@/routes/admin/transactions';
import { create as generateCreate } from '@/routes/generate';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const { auth } = usePage().props;
    const user = auth?.user;

    const navItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
        {
            title: 'Generate Copy',
            href: generateCreate.url(),
            icon: PenTool,
        },
        {
            title: 'Content History',
            href: historyIndex.url(),
            icon: History,
        },
        {
            title: 'Writing Tones',
            href: tonesIndex.url(),
            icon: Sparkles,
        },
        {
            title: 'Billing & Packages',
            href: billingIndex.url(),
            icon: CreditCard,
        },
    ];

    if (user && user.is_admin) {
        navItems.push({
            title: 'Admin Users',
            href: adminUsersIndex.url(),
            icon: Users,
        });
        navItems.push({
            title: 'Admin Ledger',
            href: adminTransactionsIndex.url(),
            icon: Settings,
        });
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
