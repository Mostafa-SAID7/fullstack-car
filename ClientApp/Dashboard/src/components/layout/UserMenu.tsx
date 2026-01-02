import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const UserMenu: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const userRole = user?.roles?.includes('Admin') ? 'Administrator' : 'User';

    return (
        <div className="flex items-center gap-3 cursor-pointer pl-1 group" onClick={() => navigate('/settings')}>
            <div className="text-right hidden sm:block">
                <div className="text-sm font-semibold group-hover:text-primary transition-colors">
                    {user?.firstName} {user?.lastName}
                </div>
                <div className="text-[10px] font-black text-muted-foreground uppercase bg-muted px-1.5 py-0.5 rounded leading-none mt-1">
                    {userRole}
                </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary overflow-hidden group-hover:border-primary/50 transition-all group-hover:scale-105 shadow-lg shadow-primary/5">
                {user?.profileImageUrl ? (
                    <img src={user.profileImageUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                    <span className="text-sm font-black tracking-tighter">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </span>
                )}
            </div>
        </div>
    );
};