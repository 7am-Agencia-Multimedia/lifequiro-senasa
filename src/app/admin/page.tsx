'use client'

import ListUsers from '@/components/form/ListUsers'
import SideBar from '@/components/layout/SideBar'
import { Button } from 'antd'
import React, { useState } from 'react'

const PageAdmin = () => {

    const [openForm, setOpenForm] = useState(false)

    return (
        <SideBar>
            <div className='flex flex-col justify-center gap-10'>
                <div className='flex flex-col justify-center items-center h-full w-full'>
                    <div className='w-full flex justify-end items-center'>
                        <Button type="primary" className='font-semibold w-fit'>+ Crear nuevo reporte</Button>
                    </div>
                </div>
                <ListUsers />
            </div>
        </SideBar>
    )
}

export default PageAdmin