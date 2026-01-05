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
        <div className="min-h-screen animate-gradient flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary-focus rounded-2xl shadow-glow mb-6"
                >
                    <Car className="w-8 h-8 text-white relative z-10" />
                </motion.div>

                <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md"
                >
                    {title}
                </motion.h2>

                {subtitle && (
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="mt-2 text-sm text-gray-300"
                    >
                        {subtitle}
                    </motion.p>
                )}
            </div>

            <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
            >
                <div className="bg-card py-8 px-4 shadow-2xl border border-border sm:rounded-2xl sm:px-10 glassmorphism">
                    {children}
                </div>
            </motion.div>
        </div>
    );
};
