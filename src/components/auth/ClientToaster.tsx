'use client'

import React, { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'

const ClientToaster = () => {
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        // Asegura que Toaster solo se monte en el cliente
        setIsClient(true)
    }, [])

    if (!isClient) return null

    return <Toaster position="top-center" />
}

export default ClientToaster
