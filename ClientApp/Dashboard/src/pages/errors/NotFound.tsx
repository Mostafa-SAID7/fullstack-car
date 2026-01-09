import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search, AlertTriangle } from 'lucide-react';
import { Button } from '../../components';

export const NotFound: React.FC = () => {
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6,
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94] as const
            }
        }
    };

    const floatingVariants = {
        animate: {
            y: [-10, 10, -10],
            rotate: [-2, 2, -2],
            transition: {
                duration: 4,
                repeat: Infinity,
                ease: [0.42, 0, 0.58, 1] as const
            }
        }
    };

    const pulseVariants = {
        animate: {
            scale: [1, 1.05, 1],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: [0.42, 0, 0.58, 1] as const
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-2xl mx-auto text-center"
            >
                {/* Animated 404 Number */}
                <motion.div
                    variants={floatingVariants}
                    animate="animate"
                    className="relative mb-8"
                >
                    <motion.h1
                        variants={itemVariants}
                        className="text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-none"
                    >
                        404
                    </motion.h1>
                    
                    {/* Floating Elements */}
                    <motion.div
                        animate={{
                            x: [0, 20, 0],
                            y: [0, -15, 0],
                            rotate: [0, 10, 0]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full opacity-80"
                    />
                    
                    <motion.div
                        animate={{
                            x: [0, -15, 0],
                            y: [0, 10, 0],
                            rotate: [0, -8, 0]
                        }}
                        transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.5
                        }}
                        className="absolute -bottom-2 -left-6 w-6 h-6 bg-pink-400 rounded-full opacity-70"
                    />
                    
                    <motion.div
                        animate={{
                            x: [0, 10, 0],
                            y: [0, -8, 0],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1
                        }}
                        className="absolute top-1/2 -right-8 w-4 h-4 bg-blue-400 rounded-full opacity-60"
                    />
                </motion.div>

                {/* Error Icon */}
                <motion.div
                    variants={itemVariants}
                    className="mb-6"
                >
                    <motion.div
                        variants={pulseVariants}
                        animate="animate"
                        className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-400 to-red-500 rounded-full shadow-lg"
                    >
                        <AlertTriangle className="w-10 h-10 text-white" />
                    </motion.div>
                </motion.div>

                {/* Title and Description */}
                <motion.div variants={itemVariants} className="mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Oops! Page Not Found
                    </h2>
                    <p className="text-lg text-gray-600 mb-2">
                        The page you're looking for seems to have wandered off into the digital void.
                    </p>
                    <p className="text-gray-500">
                        Don't worry, even the best explorers sometimes take a wrong turn!
                    </p>
                </motion.div>

                {/* Search Suggestion */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-200 shadow-lg"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Search className="w-5 h-5 text-blue-500" />
                        <h3 className="text-lg font-semibold text-gray-800">What were you looking for?</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="p-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700 transition-colors"
                        >
                            Dashboard
                        </button>
                        <button
                            onClick={() => navigate('/marketplace')}
                            className="p-2 bg-green-50 hover:bg-green-100 rounded-lg text-green-700 transition-colors"
                        >
                            Marketplace
                        </button>
                        <button
                            onClick={() => navigate('/administration/users')}
                            className="p-2 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-700 transition-colors"
                        >
                            Users
                        </button>
                        <button
                            onClick={() => navigate('/settings')}
                            className="p-2 bg-orange-50 hover:bg-orange-100 rounded-lg text-orange-700 transition-colors"
                        >
                            Settings
                        </button>
                    </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button
                            onClick={() => navigate(-1)}
                            variant="outline"
                            className="flex items-center gap-2 px-6 py-3 text-lg"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Go Back
                        </Button>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center gap-2 px-6 py-3 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                            <Home className="w-5 h-5" />
                            Back to Dashboard
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Fun Message */}
                <motion.div
                    variants={itemVariants}
                    className="mt-12"
                >
                    <motion.p
                        animate={{
                            opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="text-sm text-gray-400 italic"
                    >
                        "Not all who wander are lost... but this page definitely is!" 🗺️
                    </motion.p>
                </motion.div>
            </motion.div>
        </div>
    );
};