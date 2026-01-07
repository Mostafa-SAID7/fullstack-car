import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, Home, Lock, AlertTriangle } from 'lucide-react';
import { Button } from '../../components';

export const Forbidden: React.FC = () => {
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
                ease: "easeOut" as const
            }
        }
    };

    const shakeVariants = {
        animate: {
            x: [-2, 2, -2, 2, 0],
            transition: {
                duration: 0.5,
                repeat: Infinity,
                repeatDelay: 3
            }
        }
    };

    const lockVariants = {
        animate: {
            rotate: [-5, 5, -5, 5, 0],
            scale: [1, 1.1, 1],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut" as const
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-2xl mx-auto text-center"
            >
                {/* Animated 403 Number */}
                <motion.div
                    variants={shakeVariants}
                    animate="animate"
                    className="relative mb-8"
                >
                    <motion.h1
                        variants={itemVariants}
                        className="text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent leading-none"
                    >
                        403
                    </motion.h1>
                    
                    {/* Security Elements */}
                    <motion.div
                        animate={{
                            opacity: [0.3, 0.8, 0.3],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute -top-8 -right-8 w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center"
                    >
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                    </motion.div>
                    
                    <motion.div
                        animate={{
                            rotate: [0, 360],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute -bottom-4 -left-8 w-8 h-8 border-2 border-orange-400 rounded-full opacity-60"
                    />
                </motion.div>

                {/* Lock Icon */}
                <motion.div
                    variants={itemVariants}
                    className="mb-6"
                >
                    <motion.div
                        variants={lockVariants}
                        animate="animate"
                        className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-full shadow-2xl"
                    >
                        <Lock className="w-12 h-12 text-white" />
                    </motion.div>
                </motion.div>

                {/* Title and Description */}
                <motion.div variants={itemVariants} className="mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Access Denied
                    </h2>
                    <p className="text-lg text-gray-600 mb-2">
                        You don't have permission to access this resource.
                    </p>
                    <p className="text-gray-500">
                        This area is restricted to authorized personnel only.
                    </p>
                </motion.div>

                {/* Security Notice */}
                <motion.div
                    variants={itemVariants}
                    className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8 shadow-lg"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Shield className="w-6 h-6 text-red-500" />
                        <h3 className="text-lg font-semibold text-red-800">Security Notice</h3>
                    </div>
                    <div className="text-sm text-red-700 space-y-2">
                        <p>• This action has been logged for security purposes</p>
                        <p>• Contact your administrator if you believe this is an error</p>
                        <p>• Ensure you have the required permissions for this resource</p>
                    </div>
                </motion.div>

                {/* Possible Reasons */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-200 shadow-lg"
                >
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Possible Reasons:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span>Insufficient user privileges</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span>Session has expired</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span>Resource requires admin access</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span>Account needs verification</span>
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
                            className="flex items-center gap-2 px-6 py-3 text-lg bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
                        >
                            <Home className="w-5 h-5" />
                            Back to Dashboard
                        </Button>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button
                            onClick={() => navigate('/login')}
                            variant="outline"
                            className="flex items-center gap-2 px-6 py-3 text-lg border-red-300 text-red-600 hover:bg-red-50"
                        >
                            <Shield className="w-5 h-5" />
                            Re-authenticate
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Security Message */}
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
                        "Security is not a product, but a process." 🔒
                    </motion.p>
                </motion.div>
            </motion.div>
        </div>
    );
};