import { useLogout } from '@/hooks/useLogout';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const LogoutComponent = () => {
    const resetAuth = useAuthStore((state) => state.resetAuth);
    const logout = useLogout(resetAuth);
    const router = useRouter();

    const [hasLoggedOut, setHasLoggedOut] = useState(false);

    useEffect(() => {
        const performLogout = async () => {
            if (hasLoggedOut) return;
            setHasLoggedOut(true);

            try {
                await logout();
                console.log('Logout exitoso.');
                window.location.href = '/';
            } catch (error) {
                console.error('Error durante el logout:', error);
            }
        };

        performLogout();
    }, [logout, hasLoggedOut, router]);

    return (
        <div className="spinner">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
    )

};

export default LogoutComponent;
