import { create } from 'zustand'

export interface StateAuthInterface {
    _id: string;
    email: string;
    name: string;
    phone_number: string;
    authenticated: boolean;
    loading: boolean;
    setAuthenticated: (user: Partial<Omit<StateAuthInterface, 'authenticated' | 'loading'>>) => void;
    resetAuth: () => void;

}

export const useAuthStore = create<StateAuthInterface>((set) => ({
    _id: '',
    email: '',
    name: '',
    phone_number: '',
    authenticated: false,
    loading: true,
    setAuthenticated: (user) => set((state) => ({ ...state, ...user, authenticated: true, loading: false })),
    resetAuth: () => set((state) => {
        //console.log('ResetAuth ejecutado: limpiando estado global.');
        return {
            _id: '',
            email: '',
            name: '',
            phone_number: '',
            token: '',
            authenticated: false,
            loading: true,
        };
    }),
}))