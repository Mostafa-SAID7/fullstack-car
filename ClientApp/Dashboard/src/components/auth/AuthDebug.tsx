import React from 'react';
import { useAuth } from '../../hooks';
import { Card, CardHeader, CardTitle, CardContent } from '../layout/cards';
import Button from '../forms/buttons/Button';
import { authService } from '../../services/auth';

export const AuthDebug: React.FC = () => {
    const { user, isAuthenticated, loading } = useAuth();

    const handleLogout = async () => {
        await authService.logout();
        window.location.reload();
    };

    return (
        <div className="p-8 max-w-2xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Auth State Debugger</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="font-semibold">Is Authenticated:</div>
                        <div className={isAuthenticated ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                            {isAuthenticated ? "YES" : "NO"}
                        </div>

                        <div className="font-semibold">Loading state:</div>
                        <div>{loading ? "TRUE" : "FALSE"}</div>

                        <div className="font-semibold">User Object:</div>
                        <pre className="text-xs bg-muted p-2 rounded col-span-2 overflow-auto max-h-40">
                            {JSON.stringify(user, null, 2)}
                        </pre>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button variant="outline" onClick={() => window.location.reload()}>
                            Refresh Page
                        </Button>
                        <Button variant="destructive" onClick={handleLogout}>
                            Force Logout
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>LocalStorage Info</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-sm space-y-2">
                        <div>
                            <span className="font-semibold">Token exists:</span> {localStorage.getItem('auth_token') ? "✅" : "❌"}
                        </div>
                        <div>
                            <span className="font-semibold">User exists:</span> {localStorage.getItem('auth_user') ? "✅" : "❌"}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
