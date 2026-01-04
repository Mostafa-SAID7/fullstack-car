import React from 'react';
import { AlertTriangle, Trash2, Ban } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

interface DangerZoneProps {
    onDeactivate: () => void;
    onDelete: () => void;
}

export const DangerZone: React.FC<DangerZoneProps> = ({ onDeactivate, onDelete }) => {
    return (
        <Card className="border-red-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="bg-red-50 p-6 border-b border-red-200">
                <div className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="w-5 h-5" />
                    <h3 className="font-bold text-lg">Danger Zone</h3>
                </div>
                <p className="text-red-600/80 mt-1 text-sm">
                    Irreversible and destructive actions. Please be careful.
                </p>
            </div>

            <CardContent className="space-y-6 pt-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <div className="font-medium">Deactivate Account</div>
                        <div className="text-sm text-muted-foreground">Temporarily disable your account. You can reactivate it anytime.</div>
                    </div>
                    <Button
                        variant="outline"
                        className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 border-orange-200"
                        onClick={onDeactivate}
                    >
                        <Ban className="w-4 h-4 mr-2" />
                        Deactivate
                    </Button>
                </div>

                <div className="h-px bg-border" />

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <div className="font-medium text-red-600">Delete Account</div>
                        <div className="text-sm text-muted-foreground">Permanently remove your account and all of your content.</div>
                    </div>
                    <Button
                        variant="destructive"
                        onClick={onDelete}
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
