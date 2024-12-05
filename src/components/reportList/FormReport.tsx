'use client'

import React, { useState } from 'react'
import { Button, DatePicker, Form, Input, InputNumber, Select, Modal, Switch } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import axios from 'axios';
import { CreateReportTypes, userData } from '@/utils/types';

const { RangePicker } = DatePicker;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
    },
};

const baseStyle = {
    width: '100%',
};

type Props = {
    modalForm: boolean,
    showModalForm: () => void,
    userData: userData | undefined,
    clearModal: () => void,
}

const { Option } = Select;
const FormReport = ({ modalForm, showModalForm, userData, clearModal }: Props) => {

    const [isClient, setIsClient] = useState(false);
    const [doctorName, setDoctorName] = useState("Dr. Juan Pérez");

    // useEffect(() => {
    //     async function handleGetUserList() {
    //         try {
    //             const { data: res } = await axios.request({
    //                 method: 'GET',
    //                 url: 'pierviceset',
    //             });
    //             setInitLoading(false);
    //             setData(res.users);
    //             setList(res.users);
    //         } catch (error) {
    //             console.error(error);
    //             setInitLoading(false);
    //         }
    //     }
    //     handleGetUserList();
    //  }, []);

    const onSubmit = async (data: CreateReportTypes) => {
        //setLoading(true);
        try {
            const { data: response } = await axios.request({
                url: '/api/orders/calculatedCost',
                method: 'POST',
                data: {
                    code: data.code,
                    affiliate_id: data.affiliate_id,
                    affiliate_name: data.affiliate_name,
                    social_security_number: data.social_security_number,
                    age: data.age,
                    phone: data.phone,
                    study_center: data.study_center,
                    procedure_center: data.procedure_center,
                    traffic_accident: data.traffic_accident,
                    diagnosis: data.diagnosis,
                    procedure_names: data.procedure_names,
                    current_disease_history: data.current_disease_history,
                },
            });
        } catch (error) {
            console.log(error);
        } finally {
            //setLoading(false);
        }
    };

    const onFinish = (data: CreateReportTypes) => {
        console.log('Received values of form: ', data);
        onSubmit(data);
    };

    return (
        <Modal
            title={<h5 className='text-3xl text-center'>Crear Reporte</h5>}
            open={modalForm}
            confirmLoading={true}
            onCancel={clearModal}
            centered
            footer={null}
            maskClosable={false}
            className="custom-modal-form"
        >
            <div className="modal-content max-w-5xl p-5">
                <Form
                    name='Create Report'
                    style={{ width: '100%' }}
                    className={`flex flex-col py-5 gap-5`}
                    onFinish={onFinish}
                    initialValues={{
                        doctorName,
                        code: userData?.id || '',
                        affiliate_name: userData?.firstname && userData?.lastname ? `${userData.firstname} ${userData.lastname}` : '',
                        idCard: userData?.document_no || '-',
                        social_security_number: userData?.social_id || '-',
                        age: userData?.age || '',
                        phone: userData?.phone || '',
                        gender: userData?.gender || '',
                    }}>
                    <div className='flex gap-5 w-full h-16'>
                        <Form.Item
                            label="Nombre del médico"
                            layout="vertical"
                            labelCol={{ span: 24 }}
                            name="doctorName"
                            rules={[{ required: true }]}
                            style={baseStyle}
                        //hasFeedback
                        >
                            <Input style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item
                            label="Código"
                            layout="vertical"
                            labelCol={{ span: 24 }}
                            name="code"
                            rules={[{ required: true, message: 'Ingrese el código' }]}
                            style={baseStyle}
                        //hasFeedback
                        >
                            <InputNumber style={{ width: '100%' }} />
                        </Form.Item>
                    </div>
                    <div className='flex gap-5 w-full h-16'>
                        <Form.Item
                            label="Nombre del afiliado"
                            layout="vertical"
                            labelCol={{ span: 24 }}
                            name="affiliate_name"
                            rules={[{ required: true, message: 'Ingrese el nombre del afiliado' }]}
                            style={baseStyle}
                        >
                            <Input style={{ width: '100%' }} disabled />
                        </Form.Item>
                        <Form.Item
                            label="NSS"
                            layout="vertical"
                            labelCol={{ span: 24 }}
                            name="social_security_number"
                            rules={[{ required: true, message: 'Ingrese el NSS' }]}
                            style={baseStyle}
                        >
                            <InputNumber style={{ width: '100%' }} disabled />
                        </Form.Item>
                    </div>
                    <div className='flex gap-5 w-full h-16'>
                        <Form.Item
                            label="Cédula"
                            layout="vertical"
                            labelCol={{ span: 24 }}
                            name="idCard"
                            rules={[{ required: true, message: 'Ingrese la cédula' }]}
                            style={baseStyle}
                        >
                            <InputNumber style={{ width: '100%' }} disabled />
                        </Form.Item>
                        <Form.Item
                            label="Edad"
                            layout="vertical"
                            labelCol={{ span: 24 }}
                            name="age"
                            rules={[{ required: true, message: 'Ingrese la edad' }]}
                            style={baseStyle}
                        >
                            <InputNumber style={{ width: '100%' }} disabled />
                        </Form.Item>
                    </div>
                    {/* GENERO Y PHONE */}
                    <div className='flex gap-5 w-full h-16'>
                        <Form.Item
                            label="Sexo"
                            layout="vertical"
                            labelCol={{ span: 24 }}
                            name="gender"
                            rules={[{ required: true, message: 'Seleccione una opción' }]}
                            style={baseStyle}
                        >
                            <Select style={{ width: '100%' }} disabled>
                                <Option value="F">Femenino</Option>
                                <Option value="M">Masculino</Option>
                                {/* <Option value="demo3">Demo 3</Option> */}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Número de Teléfono"
                            layout="vertical"
                            labelCol={{ span: 24 }}
                            name="phone"
                            rules={[
                                { required: true, message: 'Por favor ingresa tu teléfono' },
                                { pattern: /^[0-9]{10}$/, message: 'El número debe contener solo 10 dígitos' },
                            ]}
                            style={baseStyle}
                        >
                            <Input type="tel" placeholder="Introduce tu número de teléfono" disabled />
                        </Form.Item>
                    </div>
                    {/* SWITCH Y SELECT */}
                    <div className='flex justify-center items-center gap-5 w-full h-20'>
                        <Form.Item
                            label="Accidente de tránsito?"
                            layout="vertical"
                            valuePropName="checked"
                            name="traffic_accident"
                            rules={[{ required: false, message: 'Indique si fue un accidente de tránsito' }]}
                            style={baseStyle}
                        >
                            <Switch />
                        </Form.Item>
                        <Form.Item
                            label="Centro"
                            layout="vertical"
                            labelCol={{ span: 24 }}
                            name="study_center"
                            rules={[{ required: true, message: 'Seleccione un centro' }]}
                            style={baseStyle}
                            className='pb-5'
                        >
                            <Select style={{ width: '100%' }}>
                                <Option value="demo1">Demo 1</Option>
                                <Option value="demo2">Demo 2</Option>
                                <Option value="demo3">Demo 3</Option>
                            </Select>
                        </Form.Item>
                    </div>
                    {/* ENFERMEDAD Y VARIANTE */}
                    <div className='flex gap-5 w-full h-16'>
                        <Form.Item
                            label="Seleccione enfermedad"
                            layout="vertical"
                            labelCol={{ span: 24 }}
                            name="diagnosis"
                            rules={[{ required: true, message: 'Seleccione una enfermedad' }]}
                            style={baseStyle}
                        >
                            <Select style={{ width: '100%' }}>
                                <Option value="demo1">Demo 1</Option>
                                <Option value="demo2">Demo 2</Option>
                                <Option value="demo3">Demo 3</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Seleccione la variante"
                            layout="vertical"
                            labelCol={{ span: 24 }}
                            name="variants_names"
                            rules={[{ required: true, message: 'Seleccione una variante' }]}
                            style={baseStyle}
                        >
                            <Select style={{ width: '100%' }}>
                                <Option value="demo1">Demo 1</Option>
                                <Option value="demo2">Demo 2</Option>
                                <Option value="demo3">Demo 3</Option>
                            </Select>
                        </Form.Item>
                    </div>
                    {/* TEXT AREA */}
                    <div className='flex flex-col gap-20 w-full'>
                        <Form.Item
                            label="Procedimientos a seguir"
                            layout="vertical"
                            labelCol={{ span: 24 }}
                            name="procedure_names"
                            rules={[{ required: true, message: 'Ingrese los procedimientos a seguir' }]}
                            className='min-h-12'
                        >
                            <TextArea rows={4} />
                        </Form.Item>
                        <Form.Item
                            label="Historia de la enfermedad"
                            layout="vertical"
                            labelCol={{ span: 24 }}
                            name="current_disease_history"
                            rules={[{ required: true, message: 'Ingrese la historia de la enfermedad' }]}
                            className='min-h-12'
                        >
                            <TextArea rows={4} />
                        </Form.Item>
                        <Form.Item
                            label="Antecedente patológico"
                            layout="vertical"
                            labelCol={{ span: 24 }}
                            name="pathologicalHistory"
                            rules={[{ required: true, message: 'Ingrese el antecedente patológico' }]}
                            className='min-h-12'
                        >
                            <TextArea rows={4} maxLength={100} showCount={true} />
                        </Form.Item>
                        {/* BUTTON */}
                        <div className='flex justify-center items-center w-full pt-5'>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" size='large' className='w-full'>
                                    Crear Reporte
                                </Button>
                            </Form.Item>
                        </div>
                    </div>


                </Form>
            </div>
        </Modal>
    );
}

export default FormReport;
