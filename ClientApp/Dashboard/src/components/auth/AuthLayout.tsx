import React from 'react';
import { motion } from 'framer-motion';
import { Car } from 'lucide-react';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {

    return (
        <div className="min-h-screen animate-gradient flex flex-col justify-center py-6 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{
                        scale: 1,
                        opacity: 1,
                        boxShadow: "0 0 25px hsl(var(--primary) / 0.6)"
                    }}
                    whileHover={{
                        scale: 1.1,
                        boxShadow: "0 0 50px hsl(var(--primary) / 0.8)",
                        transition: { duration: 0.2 }
                    }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
                    className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary-focus rounded-2xl mb-4 border border-primary/20 cursor-pointer"
                >
                    <Car className="w-8 h-8 text-white relative z-10" />
                </motion.div>

                <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md"
                >
                    {title}
                </motion.h2>

                {subtitle && (
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                        className="mt-2 text-sm text-gray-300"
                    >
                        {subtitle}
                    </motion.p>
                )}
            </div>

            <motion.div
                initial={{ y: 40, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 40, opacity: 0, scale: 0.95 }}
                transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
                className="mt-6 sm:mx-auto sm:w-full sm:max-w-md"
            >
                <div className="bg-card py-6 px-4 shadow-2xl border border-border sm:rounded-2xl sm:px-10 glassmorphism">
                    {children}
                </div>
            </motion.div>
        </div>
    );
};
