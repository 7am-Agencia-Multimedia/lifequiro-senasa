'use client'

import { userData } from '@/utils/types';
import { UserOutlined } from '@ant-design/icons';
import { Button, InputNumber, Modal } from 'antd';
import axios from 'axios';
import Image from 'next/image';
import React, { useState } from 'react'


type Props = {
    showModal: () => void,
    visible: boolean,
    idUser: number | undefined,
    //handleModalCancel: () => void,
    handleOk: () => void,
    loading: boolean,
    handleInputChange: (value: any) => void
    errorSearchUser: boolean;
}
const SearchUser = ({ showModal, visible, idUser, handleOk, loading, handleInputChange, errorSearchUser}: Props) => {

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            // Si se presiona Enter, ejecutamos el evento de clic del botón
            handleOk();
        }
    };


    return (
        <Modal
            title={[
                <div className='w-full flex flex-col justify-end items-center gap-2'>
                    <div className='relative w-48 h-24'>
                        <Image src={'/logo_color.png'} alt='Logo Lifequiro' fill className='object-contain' />
                    </div>
                    <h4>Ingrese el id  <br className='sm:hidden' />del paciente o NSS</h4>
                </div>]}
            open={visible}
            confirmLoading={true}
            //onOk={handleOk}
            onCancel={showModal}
            centered
            footer={[
                <Button key="cancel" onClick={showModal}>
                    Cerrar
                </Button>,
                <Button key="button" type="primary" onClick={handleOk} loading={loading}>
                    Confirmar
                </Button>,
            ]}
            className="custom-modal"
        >
            <div className="flex flex-col gap-2 modal-content w-60 py-5">
                <InputNumber
                    addonBefore={<UserOutlined />}
                    style={{ width: '100%' }}
                    value={errorSearchUser ? null : idUser}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                />
                {errorSearchUser ? <p className='text-xs text-red-500'>No se encontró ningun paciente, <br/> vuelve a intentarlo.</p> : null}
            </div>
        </Modal>
    )
}

export default SearchUser