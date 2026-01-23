import { Link, useLocation } from "wouter";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import {
    LayoutDashboard,
    MessageSquare,
    GraduationCap,
    LogOut,
    Menu,
    X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface AdminLayoutProps {
    children: React.ReactNode;
}

const menuItems = [
    {
        title: "Inquiries",
        icon: MessageSquare,
        path: "/admin/dashboard",
    },
    {
        title: "Course Modules",
        icon: GraduationCap,
        path: "/admin/modules",
    },
];

export function AdminLayout({ children }: AdminLayoutProps) {
    const { user, logout, isLoggingOut } = useAdminAuth();
    const [location] = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-900 flex">
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-slate-800 border-r border-slate-700
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-700">
                    <Link href="/admin/dashboard">
                        <a className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                                <LayoutDashboard className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-display font-bold text-white">IIM Admin</span>
                        </a>
                    </Link>
                    <button
                        className="lg:hidden text-slate-400 hover:text-white"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-1">
                    {menuItems.map((item) => {
                        const isActive = location === item.path;
                        return (
                            <Link key={item.path} href={item.path}>
                                <a
                                    className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                    ${isActive
                                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                            : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                                        }
                  `}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">{item.title}</span>
                                </a>
                            </Link>
                        );
                    })}
                </nav>

                {/* User Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-primary font-bold">
                                {user?.name?.charAt(0) || 'A'}
                            </span>
                        </div>
                        <div>
                            <p className="text-white font-medium text-sm">{user?.name || 'Admin'}</p>
                            <p className="text-slate-400 text-xs">@{user?.username}</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                        onClick={() => logout()}
                        disabled={isLoggingOut}
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        {isLoggingOut ? 'Logging out...' : 'Logout'}
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Top Header */}
                <header className="h-16 bg-slate-800 border-b border-slate-700 flex items-center px-4 lg:px-8">
                    <button
                        className="lg:hidden text-slate-400 hover:text-white mr-4"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <h1 className="text-white font-display font-bold text-lg">
                        {menuItems.find(item => item.path === location)?.title || 'Dashboard'}
                    </h1>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-8 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
