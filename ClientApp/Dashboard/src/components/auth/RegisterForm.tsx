import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, User, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import Button from '../forms/buttons/Button';
import Input from '../forms/inputs/Input';
import Checkbox from '../forms/checkboxes/Checkbox';
import { authService } from '../../services/auth';

export const RegisterForm: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [userName, setUserName] = useState('');
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError(t('passwords_dont_match', 'Passwords do not match.'));
            return;
        }

        if (!acceptTerms) {
            setError(t('accept_terms_required', 'You must accept the terms and conditions.'));
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const result = await authService.register({
                email,
                password,
                fullName,
                userName,
                confirmPassword
            });
            if (result.succeeded) {
                navigate('/login?registered=true');
            } else {
                setError(result.errors?.[0] || result.message || t('registration_failed', 'Failed to create account. Please try again.'));
            }
        } catch (err: any) {
            setError(err.message || t('registration_failed', 'Failed to create account. Please try again.'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive flex items-center gap-2 text-sm backdrop-blur-sm">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-200 ml-1">
                            {t('full_name', 'Full Name')}
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                type="text"
                                variant="glass"
                                placeholder="John Doe"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="pl-10"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-200 ml-1">
                            {t('user_name', 'Username')}
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                type="text"
                                variant="glass"
                                placeholder="johndoe"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                className="pl-10"
                                required
                            />
                        </div>
                    </div>
                </div>

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

                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-200 ml-1">
                        {t('password', 'Password')}
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            variant="glass"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 pr-10"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-200 ml-1">
                        {t('confirm_password', 'Confirm Password')}
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            variant="glass"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="pl-10"
                            required
                        />
                    </div>
                </div>

                <div className="flex items-center">
                    <Checkbox
                        id="accept-terms"
                        checked={acceptTerms}
                        onCheckedChange={(checked) => setAcceptTerms(checked)}
                        required
                        className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    />
                    <label htmlFor="accept-terms" className="ml-2 block text-sm text-gray-300 cursor-pointer select-none">
                        {t('i_accept_the', 'I accept the')}{' '}
                        <Link to="/terms" className="text-primary-foreground hover:underline hover:text-white transition-colors">{t('terms_and_conditions', 'Terms & Conditions')}</Link>
                    </label>
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-3 h-auto text-lg font-bold shadow-glow hover:shadow-glow/80 transition-all duration-300 border border-primary/20"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            {t('creating_account', 'Creating Account...')}
                        </>
                    ) : (
                        t('register', 'Register')
                    )}
                </Button>
            </form>

            <div className="mt-6 text-center">
                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-transparent text-gray-400">
                            {t('already_have_account', 'Already have an account?')}
                        </span>
                    </div>
                </div>

                <Link to="/login">
                    <Button
                        variant="outline"
                        className="w-full py-4 h-auto border-white/10 bg-transparent text-white hover:bg-white/5 hover:text-white hover:border-white/20"
                    >
                        {t('sign_in', 'Sign In')}
                    </Button>
                </Link>
            </div>
        </div>
    );
};
