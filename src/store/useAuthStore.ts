import { create } from 'zustand'

export interface StateAuthInterface {
    _id: string;
    email: string;
    authenticated: boolean;
    loading: boolean;
    setAuthenticated: (user: Partial<Omit<StateAuthInterface, 'authenticated' | 'loading'>>) => void;
    resetAuth: () => void;

}

export const useAuthStore = create<StateAuthInterface>((set) => ({
    _id: '',
    email: '',
    authenticated: false,
    loading: true,
    setAuthenticated: (user) => set((state) => ({ ...state, ...user, authenticated: true, loading: false })),
    resetAuth: () => set((state) => ({ ...state, token: '', authenticated: false, loading: false })),
}))