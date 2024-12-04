'use client'

import { UserOutlined } from '@ant-design/icons';
import { Button, InputNumber, Modal } from 'antd';
import axios from 'axios';
import Image from 'next/image';
import React, { useState } from 'react'


type Props = {
    showModal: () => void,
    visible: boolean,
}
const SearchUser = ({ showModal, visible }: Props) => {

    const [idUser, setIdUser] = useState<number | undefined>(undefined);

    const handleInputChange = (value: any) => {
        setIdUser(value);
    };

    const handleModalCancel = () => {
        setIdUser(undefined);  
        showModal();
    };

    console.log(idUser) 


    const handleOk = async () => {
        try {
            const { data: res } = await axios.request({
                method: 'POST',
                url: '/api/user/id',
                withCredentials: true,
                data: {paciente_id: idUser},
            })
            console.log(res)
        } catch (error) {
            console.error(error)
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
            onCancel={handleModalCancel}
            centered
            footer={[
                <Button key="cancel" onClick={handleModalCancel}>
                    Cerrar
                </Button>,
                <Button key="button" type="primary" onClick={handleOk}>
                    Confirmar
                </Button>,
            ]}
            className="custom-modal"
        >
            <div className="modal-content w-60 py-5">
            <InputNumber
                    addonBefore={<UserOutlined />}
                    style={{ width: '100%' }}
                    value={idUser}  
                    onChange={handleInputChange}
            />
            </div>
        </Modal>
    )
}

export default SearchUser