'use client'

import React, { useEffect, useState } from 'react'
import { Button, Form, Input, Modal } from 'antd';
import axios from 'axios';
import { VariantsTypes } from '@/utils/types';

type Props = {
    modalForm: boolean,
    showModalForm: () => void,
    setAddDisease: React.Dispatch<boolean>
}

type VariantsState = VariantsTypes[];

const FormAddDisease = ({ modalForm, showModalForm, setAddDisease }: Props) => {

    const [form] = Form.useForm();

    const [action, setAction] = useState<'save' | 'saveAndClose'>('save');
    const [save, setSave] = useState(false)
    const [saveAndClose, setSaveAndClose] = useState(false)
    const [diseaseFormValue, setDiseaseFormValue] = useState('')
    const [variantes, setVariantes] = useState<VariantsState>([
        { id: 1, name: '', description: '', treatment: { 1: '', 2: '', 3: '', 4: '', 5: '' } },
    ]);

    const handleCloseModal = () => {
        form.resetFields()
        setDiseaseFormValue('')
        setVariantes([
            {
                id: 1,
                name: '',
                description: '',
                treatment: { 1: '', 2: '', 3: '', 4: '', 5: '' },
            },
        ]);
        showModalForm()
    }

    const agregarVariante = () => {
        setVariantes([
            ...variantes,
            {
                id: variantes.length + 1,
                name: '',
                description: '',
                treatment: { 1: '', 2: '', 3: '', 4: '', 5: '' },
            },
        ]);
    };

    const eliminarUltimaVariante = () => {
        if (variantes.length > 1) {
            setVariantes(variantes.slice(0, -1));
        }
    };

    // Función para manejar cambios en el tratamiento
    const handleTreatmentChange = (id: number | string, step: number, value: string) => {
        setVariantes((prev) =>
            prev.map((variante) =>
                variante.id === id
                    ? {
                        ...variante,
                        treatment: {
                            ...variante.treatment,
                            [step]: value,
                        },
                    }
                    : variante
            )
        );
    };

    // Función para manejar los cambios en el nombre y descripción de la variante
    const handleVariantChange = (id: number | string, field: keyof VariantsTypes, value: string) => {
        setVariantes((prev) =>
            prev.map((variante) =>
                variante.id === id ? { ...variante, [field]: value } : variante
            )
        );
    };

    const handleDiseaseValue = (value: string) => {
        setDiseaseFormValue(value)
    }

    const onSubmit = async (data: any) => {
        console.log('Received values of form: ', data);

        if (action === 'save') {
            setSave(true)
        } else if (action === 'saveAndClose') {
            setSaveAndClose(true)
        }

        setAddDisease(true)
        try {
            const { data: response } = await axios.request({
                url: '/api/disease/create',
                method: 'POST',
                data: {
                    disease: diseaseFormValue,
                    variants: variantes.map(variant => ({ name: variant.name, description: variant.description, treatment: variant.treatment })),
                },
            });

        } catch (error) {
            console.log(error);
        } finally {
            if (action === 'save') {
                setSave(false)
            } else if (action === 'saveAndClose') {
                form.resetFields()
                setSaveAndClose(false)
                setAddDisease(false);
                setDiseaseFormValue('')
                setVariantes([
                    {
                        id: 1,
                        name: '',
                        description: '',
                        treatment: { 1: '', 2: '', 3: '', 4: '', 5: '' },
                    },
                ]);
            }
        }
    };

    console.log(variantes) 

    const onFinish = async (data: any) => {
        if (action === 'save') {
            console.log('Guardar sin cerrar', data);
            onSubmit(data)
        } else if (action === 'saveAndClose') {
            console.log('Guardar y cerrar');
            onSubmit(data)
            showModalForm();
        }
        console.log('Datos a enviar:', data);
    };

    return (
        <Modal
            title={<h5 className='text-3xl'>Agregar Enfermedad</h5>}
            open={modalForm}
            confirmLoading={true}
            onCancel={handleCloseModal}
            centered
            footer={null}
            maskClosable={false}
            className="custom-modal-form"
        >
            <div className="modal-content max-w-5xl p-5 h-[inherit]">
                <Form
                    name='Create Report'
                    style={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%' }}
                    onFinish={onFinish}
                    form={form}
                    initialValues={{
                        disease: '',
                    }}
                >
                    <div className='flex flex-col gap-3'>
                        {/* INPUT DISEASE */}
                        <div className='flex gap-5 w-full h-16'>
                            <Form.Item
                                label="Enfermedad"
                                layout="vertical"
                                labelCol={{ span: 24 }}
                                name="disease"
                                rules={[{ required: true, message: 'Debes ingresar el nombre de la enfermedad' }]}
                                style={{ width: '100%' }}
                            >
                                <Input
                                    value={diseaseFormValue}
                                    onChange={(e) => handleDiseaseValue(e.target.value)}
                                    placeholder='Ingresa una enfermedad'
                                />
                            </Form.Item>
                        </div>
                        {/* ADD VARIANT */}
                        <div className='flex flex-col gap-5' style={{ flexGrow: 1 }}>
                            {variantes.map((variante) => (
                                <div key={variante.id}>
                                    <div className='flex flex-col gap-5 py-3 w-full'>
                                        <h4 className='text-lg font-semibold'>VARIANTE #{variante.id}</h4>
                                        <div className='flex flex-col gap-5'>
                                            <div className='flex flex-col gap-5 w-full'>
                                                <div className='flex gap-5 w-full h-16'>
                                                    <Form.Item
                                                        label="Nombre de la variante"
                                                        layout="vertical"
                                                        labelCol={{ span: 24 }}
                                                        name={`variant_name_${variante.id}`}
                                                        rules={[{ required: true, message: 'Debes ingresar una variante' }]}
                                                        style={{ width: '100%' }}
                                                    >
                                                        <Input
                                                            value={variante.name}
                                                            onChange={(e) => handleVariantChange(variante.id, 'name', e.target.value)}
                                                            placeholder='Ingresa una variante de la enfermedad'
                                                        />
                                                    </Form.Item>
                                                </div>
                                                <div className='flex gap-5 w-full h-16'>
                                                    <Form.Item
                                                        label="Descripción"
                                                        layout="vertical"
                                                        labelCol={{ span: 24 }}
                                                        name={`variant_description_${variante.id}`}
                                                        rules={[{ required: true, message: 'Debes ingresar una descripcion' }]}
                                                        style={{ width: '100%' }}
                                                    >
                                                        <Input
                                                            value={variante.description}
                                                            onChange={(e) => handleVariantChange(variante.id, 'description', e.target.value)}
                                                            placeholder='Ingresa una descripción de la enfermedad'
                                                        />
                                                    </Form.Item>
                                                </div>
                                            </div>
                                            <div className='flex flex-col gap-5'>
                                                <h5 className='font-semibold'>Plan a seguir</h5>
                                                <div className='flex flex-col gap-1'>
                                                    {[1, 2, 3, 4, 5].map((step) => (
                                                        <Form.Item
                                                            key={step}
                                                            name={`variant${variante.id}_treatment_${step}`}
                                                            rules={[{ required: true, message: `Debes ingresar el paso ${step} de la Variante #${variante.id}` }]}
                                                        >
                                                            <Input
                                                                placeholder={`Paso: ${step}`}
                                                                value={variante.treatment[step]}
                                                                onChange={(e) => handleTreatmentChange(variante.id, step, e.target.value)}
                                                            />
                                                        </Form.Item>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={`flex w-full justify-end`}>
                        {variantes.length > 1 ? (
                            <div className='flex justify-between w-full'>
                                <Form.Item className='w-fit'>
                                    <Button variant='outlined' color='danger' onClick={eliminarUltimaVariante} block>
                                        Eliminar última variante
                                    </Button>
                                </Form.Item>
                                <Form.Item className='w-fit'>
                                    <Button type="dashed" onClick={agregarVariante} block>
                                        + Agregar Variante
                                    </Button>
                                </Form.Item>
                            </div>
                        ) : (
                            <Form.Item className='w-fit'>
                                <Button type="dashed" onClick={agregarVariante} block>
                                    + Agregar Variante
                                </Button>
                            </Form.Item>
                        )}
                    </div>

                    {/* Botones para guardar */}
                    <div className='flex justify-between w-full gap-5 pt-5'>
                        <div className="flex gap-5">
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size='large'
                                    className='w-full'
                                    loading={save}
                                    onClick={() => setAction('save')}
                                >
                                    Guardar
                                </Button>
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size='large'
                                    className='w-full'
                                    loading={saveAndClose}
                                    onClick={() => setAction('saveAndClose')}
                                >
                                    Guardar y cerrar
                                </Button>
                            </Form.Item>
                        </div>
                        <Button onClick={showModalForm} color="default" variant="filled" htmlType="button" size='large' className='w-fit'>
                            Cancelar
                        </Button>
                    </div>
                </Form>
            </div>
        </Modal>
    );
}

export default FormAddDisease;
