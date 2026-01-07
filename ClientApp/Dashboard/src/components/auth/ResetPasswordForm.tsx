import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lock, Loader2, AlertCircle, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import Button from '../forms/buttons/Button';
import Input from '../forms/inputs/Input';
import { authService } from '../../services/auth';

export const ResetPasswordForm: React.FC = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError(t('passwords_dont_match', 'Passwords do not match.'));
            return;
        }

        if (!token || !email) {
            setError(t('invalid_reset_link', 'Invalid or expired reset link.'));
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const result = await authService.resetPassword({
                token,
                email,
                newPassword: password,
                confirmPassword: password
            });
            if (result.succeeded) {
                setIsSuccess(true);
            } else {
                setError(result.errors?.[0] || result.message || t('reset_failed', 'Failed to reset password. Please try again.'));
            }
        } catch (err: any) {
            setError(err.message || t('reset_failed', 'Failed to reset password. Please try again.'));
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-2">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                    {t('password_reset_success', 'Password Reset Successful')}
                </h3>
                <p className="text-muted-foreground text-sm">
                    {t('password_reset_success_desc', 'Your password has been successfully reset. You can now sign in with your new password.')}
                </p>
                <div className="pt-4">
                    <Link to="/login">
                        <Button className="w-full">
                            {t('sign_in', 'Sign In')}
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive flex items-center gap-2 text-sm">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                <div className="space-y-1">
                    <label className="text-sm font-medium text-foreground ml-1">
                        {t('new_password', 'New Password')}
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 pr-10"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-muted text-muted-foreground transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-foreground ml-1">
                        {t('confirm_new_password', 'Confirm New Password')}
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="pl-10"
                            required
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-4 h-auto text-lg font-bold"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            {t('resetting', 'Resetting...')}
                        </>
                    ) : (
                        t('reset_password', 'Reset Password')
                    )}
                </Button>
            </form>
        </div>
    );
};
