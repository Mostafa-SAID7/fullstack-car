import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Server, RefreshCw, ArrowLeft, Home, AlertCircle, Zap } from 'lucide-react';
import { Button } from '../../components';

export const ServerError: React.FC = () => {
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
                ease: "easeOut"
            }
        }
    };

    const glitchVariants = {
        animate: {
            x: [-2, 2, -1, 1, 0],
            skew: [-1, 1, -0.5, 0.5, 0],
            transition: {
                duration: 0.3,
                repeat: Infinity,
                repeatDelay: 2
            }
        }
    };

    const sparkVariants = {
        animate: {
            scale: [0, 1, 0],
            rotate: [0, 180, 360],
            opacity: [0, 1, 0],
            transition: {
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center p-4">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-2xl mx-auto text-center"
            >
                {/* Animated 500 Number */}
                <motion.div
                    variants={glitchVariants}
                    animate="animate"
                    className="relative mb-8"
                >
                    <motion.h1
                        variants={itemVariants}
                        className="text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent leading-none"
                    >
                        500
                    </motion.h1>
                    
                    {/* Glitch Effects */}
                    <motion.div
                        variants={sparkVariants}
                        animate="animate"
                        className="absolute -top-4 -right-4 w-6 h-6"
                    >
                        <Zap className="w-6 h-6 text-yellow-500" />
                    </motion.div>
                    
                    <motion.div
                        animate={{
                            opacity: [0, 1, 0],
                            scale: [0.8, 1.2, 0.8]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.5
                        }}
                        className="absolute -bottom-2 -left-6 w-8 h-8 bg-red-500/30 rounded-full"
                    />
                    
                    <motion.div
                        animate={{
                            x: [0, 5, -5, 0],
                            opacity: [0.3, 0.8, 0.3]
                        }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1
                        }}
                        className="absolute top-1/2 -right-8 w-4 h-4 bg-purple-500/50 rounded-full"
                    />
                </motion.div>

                {/* Server Icon */}
                <motion.div
                    variants={itemVariants}
                    className="mb-6"
                >
                    <motion.div
                        animate={{
                            rotate: [0, -5, 5, 0],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full shadow-2xl"
                    >
                        <Server className="w-12 h-12 text-white" />
                    </motion.div>
                </motion.div>

                {/* Title and Description */}
                <motion.div variants={itemVariants} className="mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Internal Server Error
                    </h2>
                    <p className="text-lg text-gray-600 mb-2">
                        Something went wrong on our end. Our servers are having a moment.
                    </p>
                    <p className="text-gray-500">
                        Don't worry, our team has been notified and is working on it!
                    </p>
                </motion.div>

                {/* Error Details */}
                <motion.div
                    variants={itemVariants}
                    className="bg-purple-50 border border-purple-200 rounded-2xl p-6 mb-8 shadow-lg"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <AlertCircle className="w-6 h-6 text-purple-500" />
                        <h3 className="text-lg font-semibold text-purple-800">What Happened?</h3>
                    </div>
                    <div className="text-sm text-purple-700 space-y-2">
                        <p>• The server encountered an unexpected condition</p>
                        <p>• This prevented it from fulfilling your request</p>
                        <p>• Our monitoring systems have been alerted</p>
                        <p>• The issue is being investigated by our technical team</p>
                    </div>
                </motion.div>

                {/* Troubleshooting Steps */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-200 shadow-lg"
                >
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Try These Steps:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-start gap-2">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs font-bold text-blue-600">1</span>
                            </div>
                            <span>Refresh the page</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs font-bold text-green-600">2</span>
                            </div>
                            <span>Wait a few minutes and try again</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs font-bold text-orange-600">3</span>
                            </div>
                            <span>Clear your browser cache</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs font-bold text-purple-600">4</span>
                            </div>
                            <span>Contact support if issue persists</span>
                        </div>
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
                            onClick={handleRefresh}
                            className="flex items-center gap-2 px-6 py-3 text-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                        >
                            <RefreshCw className="w-5 h-5" />
                            Refresh Page
                        </Button>
                    </motion.div>

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
                            variant="outline"
                            className="flex items-center gap-2 px-6 py-3 text-lg"
                        >
                            <Home className="w-5 h-5" />
                            Dashboard
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Status Message */}
                <motion.div
                    variants={itemVariants}
                    className="mt-12"
                >
                    <motion.div
                        animate={{
                            opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="flex items-center justify-center gap-2"
                    >
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <p className="text-sm text-gray-400 italic">
                            System status: Investigating issue... 🔧
                        </p>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
};