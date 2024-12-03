'use client'

import SideBar from '@/components/layout/SideBar'
import { Button } from 'antd'
import React, { useState } from 'react'

const PageTest = () => {

    const [openForm, setOpenForm] = useState(false)

    return (
        <SideBar>
            <div className='flex flex-col justify-center items-center h-full'>
                <div className='w-full flex justify-end items-center'>
                    <Button type="primary" className='font-semibold w-28'>+ Agregar</Button>
                </div>
            </div>
        </SideBar>
    )
}

export default PageTest