import { serialize } from 'cookie';

export const useLogout = (resetAuth: () => void) => {
    return () => {
        return new Promise<void>((resolve) => {
            console.log('Logout iniciado: Eliminando cookie y reseteando estado.');
            document.cookie = serialize('auth-token', '', { maxAge: -1 });
            resetAuth();
            console.log('Estado reseteado. Resolviendo promesa...');
            setTimeout(() => {
                resolve(); 
                console.log('Promesa resuelta. Logout completado.');
            }, 100); 
        });
    };
};