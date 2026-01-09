import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import Button from '../forms/buttons/Button';
import Input from '../forms/inputs/Input';
import Checkbox from '../forms/checkboxes/Checkbox';
import { authService } from '../../services/auth';

export const LoginForm: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        console.log('[LoginForm] Attempting login with:', { email, rememberMe });

        try {
            const result = await authService.login({ email, password, rememberMe });
            console.log('[LoginForm] Login result:', result);
            
            if (result.succeeded) {
                console.log('[LoginForm] Login successful, checking auth state...');
                
                // Check authentication state immediately
                const isAuth = authService.isAuthenticated();
                const currentUser = authService.getCurrentUser();
                
                console.log('[LoginForm] Auth state after login:', { 
                    isAuth, 
                    currentUser: currentUser?.name,
                    hasToken: !!localStorage.getItem('auth_token'),
                    hasUser: !!localStorage.getItem('auth_user')
                });
                
                if (isAuth && currentUser) {
                    console.log('[LoginForm] Authentication verified, navigating...');
                    
                    // Check for redirect URL
                    const redirectUrl = localStorage.getItem('redirectUrl');
                    if (redirectUrl) {
                        localStorage.removeItem('redirectUrl');
                        console.log('[LoginForm] Redirecting to stored URL:', redirectUrl);
                        navigate(redirectUrl);
                    } else {
                        navigate('/dashboard');
                    }
                } else {
                    console.error('[LoginForm] Authentication state verification failed:', {
                        isAuth,
                        hasUser: !!currentUser,
                        tokenExists: !!localStorage.getItem('auth_token'),
                        userExists: !!localStorage.getItem('auth_user')
                    });
                    setError('Authentication state error. Please try again.');
                }
            } else {
                const errorMessage = result.errors?.[0] || result.message || t('login_failed', 'Failed to sign in. Please check your credentials.');
                console.error('[LoginForm] Login failed with error:', errorMessage);
                console.error('[LoginForm] Full result object:', result);
                setError(errorMessage);
            }
        } catch (err: any) {
            console.error('[LoginForm] Login exception:', err);
            setError(err.message || t('login_failed', 'Failed to sign in. Please check your credentials.'));
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
                    <div className="flex justify-between items-center mb-1">
                        <label className="text-sm font-medium text-gray-200 ml-1">
                            {t('password', 'Password')}
                        </label>
                        <Link
                            to="/forgot-password"
                            className="text-xs font-semibold text-primary-foreground/80 hover:text-white transition-colors"
                        >
                            {t('forgot_password', 'Forgot password?')}
                        </Link>
                    </div>
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

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Checkbox
                            id="remember-me"
                            checked={rememberMe}
                            onCheckedChange={(checked) => setRememberMe(checked)}
                            className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300 cursor-pointer select-none">
                            {t('remember_me', 'Remember me')}
                        </label>
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
                            {t('signing_in', 'Signing in...')}
                        </>
                    ) : (
                        t('sign_in', 'Sign In')
                    )}
                </Button>
            </form>

            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-transparent text-gray-400">
                            {t('no_account', 'Don\'t have an account?')}
                        </span>
                    </div>
                </div>

                <div className="mt-6">
                    <Link to="/register">
                        <Button
                            variant="outline"
                            className="w-full py-4 h-auto border-white/10 bg-transparent text-white hover:bg-white/5 hover:text-white hover:border-white/20"
                        >
                            {t('create_account', 'Create a new account')}
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};
