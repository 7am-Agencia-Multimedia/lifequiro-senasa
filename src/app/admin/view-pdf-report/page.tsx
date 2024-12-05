'use client'

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const ViewPdf = () => {

    const router = useRouter()

    useEffect(() => {
        router.push('/admin')
    }, []);

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
    )
}

export default ViewPdf