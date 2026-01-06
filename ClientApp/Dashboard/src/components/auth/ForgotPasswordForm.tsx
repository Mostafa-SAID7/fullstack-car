import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Loader2, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button, Input } from '../index';
import { authService } from '../../services/auth';

export const ForgotPasswordForm: React.FC = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await authService.forgotPassword({ email });
            setIsSubmitted(true);
        } catch (err: any) {
            setError(err.message || t('reset_failed', 'Failed to process request. Please try again.'));
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-2">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                    {t('check_your_email', 'Check your email')}
                </h3>
                <p className="text-muted-foreground text-sm">
                    {t('reset_link_sent', 'We have sent a password reset link to your email address.')}
                </p>
                <div className="pt-4">
                    <Link to="/login">
                        <Button variant="outline" className="w-full">
                            {t('back_to_login', 'Back to login')}
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="text-center mb-4">
                <p className="text-sm text-gray-300">
                    {t('forgot_password_desc', 'Enter your email address and we will send you a link to reset your password.')}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive flex items-center gap-2 text-sm backdrop-blur-sm">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-200 ml-1">
                        {t('email_address', 'Email Address')}
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            type="email"
                            variant="glass"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10"
                            required
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-3 h-auto text-lg font-bold shadow-glow hover:shadow-glow/80 transition-all duration-300 border border-primary/20"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            {t('sending', 'Sending...')}
                        </>
                    ) : (
                        t('send_reset_link', 'Send Reset Link')
                    )}
                </Button>
            </form>

            <div className="text-center">
                <Link to="/login" className="inline-flex items-center text-sm font-medium text-primary-foreground hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t('back_to_login', 'Back to login')}
                </Link>
            </div>
        </div>
    );
};
