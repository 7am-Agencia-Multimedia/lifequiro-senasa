'use client'

import { UserOutlined } from '@ant-design/icons';
import { Button, InputNumber, Modal } from 'antd';
import Image from 'next/image';
import React, { useState } from 'react'


type Props = {
    showModal: () => void,
    visible: boolean,
}
const SearchUser = ({ showModal, visible }: Props) => {

    const handleOk = () => {
        console.log('asasas')
    };


    return (
        <Modal
            title={[
                <div className='w-full flex flex-col justify-end items-center gap-5'>
                    <div className='relative w-full h-24'>
                        <Image src={'/logo_color.png'} alt='Logo Lifequiro' fill className='object-contain' />
                    </div>
                    <h4>Nuevo Reporte</h4>
                </div>]}
            visible={visible}
            confirmLoading={true}
            //onOk={handleOk}
            onCancel={showModal}
            centered
            footer={[
                <Button key="cancel" onClick={showModal}>
                    Cerrar
                </Button>,
                <Button key="button" type="primary" onClick={handleOk}>
                    Confirmar
                </Button>,
            ]}
            className="custom-modal"
        >
            <div className="modal-content w-96">
                {/* <p>Este es el contenido del modal que se muestra centrado.</p> */}
                <InputNumber addonBefore={<UserOutlined />} style={{ width: '100%' }} />
            </div>
        </Modal>
    )
}

export default SearchUser