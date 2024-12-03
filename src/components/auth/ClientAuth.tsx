'use client'

import { useEffect } from 'react'
import { StateAuthInterface, useAuthStore } from '@/store/useAuthStore'
import axios from 'axios'

export default function ClientAuth() {
    const setAuthenticated = useAuthStore((state: StateAuthInterface) => state.setAuthenticated)
    const resetAuth = useAuthStore((state: StateAuthInterface) => state.resetAuth)

    useEffect(() => {
        async function handleGetProfile() {
            try {
                const { data: res } = await axios.request({
                    method: 'POST',
                    url: '/api/user/profile',
                    withCredentials: true,
                })
                console.log(res)
                setAuthenticated(res.data)
            } catch (error) {
                resetAuth()
            }
        }
        handleGetProfile()
    }, [setAuthenticated, resetAuth])

    return null
}
