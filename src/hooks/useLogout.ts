import { serialize } from 'cookie';

export const useLogout = (resetAuth: () => void) => {
    return () => {
        document.cookie = serialize('auth-token', '', { maxAge: -1 });
        resetAuth();
    };
};
