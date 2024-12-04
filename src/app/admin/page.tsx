'use client'

import ListUsers from '@/components/form/ListUsers'
import SideBar from '@/components/layout/SideBar'
import FormReport from '@/components/reportList/FormReport'
import SearchUser from '@/components/reportList/SearchUser'
import { UserOutlined } from '@ant-design/icons'
import { Button, Divider, InputNumber, Modal } from 'antd'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

const PageAdmin = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [openForm, setOpenForm] = useState(false)
    const [visible, setVisible] = useState(false);

    const showModal = () => {
        setVisible(!visible);
    };


    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false); 
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    return (
        isLoading ? (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
        ) : (
        <SideBar>
            <div className='flex flex-col justify-center gap-10'>
                <div className='flex flex-col justify-center items-center h-full w-full'>
                    <div className='w-full flex justify-end items-center'>
                        <Button type="primary" className='font-semibold w-fit' onClick={showModal}>+ Crear nuevo reporte</Button>
                    </div>
                </div>
                <ListUsers />
                <SearchUser
                    visible={visible}
                    showModal={showModal}
                /> 
                <FormReport/> 
            </div>
        </SideBar>)
    )
}

export default PageAdmin