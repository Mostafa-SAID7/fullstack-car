import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
    BarChart2,
    Users,
    Settings,
    Home,
    Search,
    Bell,
    Grid,
    ChevronLeft,
    LogOut
} from 'lucide-react';

interface SidebarItemProps {
    icon: React.ElementType;
    label: string;
    active?: boolean;
    collapsed?: boolean;
}

const SidebarItem = ({ icon: Icon, label, active, collapsed }: SidebarItemProps) => (
    <motion.div
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 relative group",
            active ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
            collapsed && "justify-center px-2"
        )}
    >
        {active && (
            <motion.div
                layoutId="active-pill"
                className="absolute left-0 w-1 h-6 bg-primary-foreground rounded-r-full"
            />
        )}
        <Icon className={cn("w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110", active && "scale-110")} />
        {!collapsed && <span className="font-medium truncate">{label}</span>}
    </motion.div>
);

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [collapsed, setCollapsed] = React.useState(false);

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: collapsed ? 64 : 256 }}
                className={cn(
                    "flex flex-col border-r border-border bg-card/50 backdrop-blur-xl transition-colors duration-300 ease-in-out z-20",
                )}
            >
                <div className="h-16 flex items-center justify-between px-4 border-b border-border/50">
                    {!collapsed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary px-2"
                        >
                            <Grid className="w-6 h-6" />
                            <span>DASHBOARD</span>
                        </motion.div>
                    )}
                    {collapsed && <Grid className="w-6 h-6 text-primary mx-auto" />}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-1.5 rounded-md hover:bg-primary/10 hover:text-primary transition-all text-muted-foreground"
                    >
                        <ChevronLeft className={cn("w-5 h-5 transition-transform duration-500", collapsed && "rotate-180")} />
                    </button>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    <SidebarItem icon={Home} label="Overview" active collapsed={collapsed} />
                    <SidebarItem icon={BarChart2} label="Analytics" collapsed={collapsed} />
                    <SidebarItem icon={Users} label="Customers" collapsed={collapsed} />
                    <SidebarItem icon={Grid} label="Products" collapsed={collapsed} />
                    <div className="pt-4 mt-4 border-t border-border/50">
                        <SidebarItem icon={Settings} label="Settings" collapsed={collapsed} />
                        <SidebarItem icon={LogOut} label="Logout" collapsed={collapsed} />
                    </div>
                </nav>
            </motion.aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Background Decor */}
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] -z-10" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-primary/10 rounded-full blur-[100px] -z-10" />

                {/* Topbar */}
                <header className="h-16 flex items-center justify-between px-6 border-b border-border/50 bg-background/60 backdrop-blur-xl sticky top-0 z-10">
                    <div className="flex-1 max-w-xl">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                            <input
                                type="text"
                                placeholder="Search anything..."
                                className="w-full bg-muted/50 border border-transparent focus:border-primary/20 focus:bg-background h-10 pl-10 pr-4 rounded-lg outline-none transition-all"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 rounded-full hover:bg-muted relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border-2 border-card" />
                        </button>
                        <div className="h-8 w-px bg-border mx-2" />
                        <div className="flex items-center gap-3 cursor-pointer pl-1">
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-semibold">Admin User</div>
                                <div className="text-xs text-muted-foreground">Administrator</div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary">
                                AD
                            </div>
                        </div>
                    </div>
                </header>

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto p-6 bg-muted/30">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};
