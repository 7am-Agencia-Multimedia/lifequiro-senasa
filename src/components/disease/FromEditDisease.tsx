import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Modal, Space } from 'antd';
import axios from 'axios';
import { Disease, VariantsTypes } from '@/utils/types';
import { ExclamationCircleFilled } from '@ant-design/icons';

const { confirm } = Modal;

type Props = {
    modalForm: boolean,
    showModalForm: () => void,
    showCloseEditModalForm: () => void,
    loadingGetId: boolean,
    diseaseSelected: Disease | undefined,
    errorSearchUser: boolean
    setEditDisease: React.Dispatch<boolean>
}

type VariantsState = VariantsTypes[];

const FromEditDisease = ({ modalForm, showModalForm, showCloseEditModalForm, loadingGetId, diseaseSelected, errorSearchUser, setEditDisease }: Props) => {

    const [form] = Form.useForm();
    const [action, setAction] = useState<'save' | 'saveAndClose'>('save');
    const [variantes, setVariantes] = useState<VariantsState>([]);

    const [isSaving, setIsSaving] = useState(false);
    const [isSavingAndClosing, setIsSavingAndClosing] = useState(false);

    const handleCloseModal = () => {
        showCloseEditModalForm()
        setVariantes([])
    }

    console.log(variantes)

    useEffect(() => {
        if (diseaseSelected) {
            setVariantes(diseaseSelected.variants);
        }
    }, []);

    const eliminarUltimaVariante = (id: number) => {
        setVariantes((prevVariantes) => {
            // Elimina la variante seleccionada
            const nuevasVariantes = prevVariantes.filter((variante) => variante.id !== id);

            // Reasigna el ID de las variantes restantes
            const variantesConIdsOrdenados = nuevasVariantes.map((variante, index) => ({
                ...variante,
                id: index + 1,
            }));

            return variantesConIdsOrdenados;
        });
    };


    const handleVariantChange = (id: number, field: keyof VariantsTypes, value: string) => {
        setVariantes((prev) =>
            prev.map((variante) =>
                variante.id === id ? { ...variante, [field]: value } : variante
            )
        );
    };

    const handleTreatmentChange = (id: number, step: number, value: string) => {
        setVariantes((prev) =>
            prev.map((variante) =>
                variante.id === id
                    ? { ...variante, treatment: { ...variante.treatment, [step]: value } }
                    : variante
            )
        );
    };

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

    const showDeleteConfirm = (id: number, name: string) => {
        confirm({
            title: `¿Desdeas eliminar la variante ${name}? `,
            icon: <ExclamationCircleFilled />,
            okText: 'Si',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                eliminarUltimaVariante(id)
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    console.log(variantes)

    const editDisease = async (data: any) => {
        console.log('Received values of form: ', data);

        if (action === 'save') {
            setIsSaving(true);
        } else if (action === 'saveAndClose') {
            setIsSavingAndClosing(true);
        }
        setEditDisease(true)
        try {
            const { data: response } = await axios.request({
                url: '/api/disease/edit',
                method: 'PUT',
                data: {
                    id: diseaseSelected?.id,
                    disease: data.disease,
                    variants: variantes,
                },
            });
        } catch (error) {
            console.log(error);
        } finally {
            setEditDisease(false)
            if (action === 'save') {
                setIsSaving(false);
            } else if (action === 'saveAndClose') {
                setIsSavingAndClosing(false);
            }
        }
    };

    const onFinish = async (data: any) => {
        if (action === 'save') {
            console.log('Guardar sin cerrar', data);
            editDisease(data);
        } else if (action === 'saveAndClose') {
            console.log('Guardar y cerrar');
            editDisease(data);
            showCloseEditModalForm();
        }
        console.log('Datos a enviar:', data);
    };

    return (
        <Modal
            title={<h5 className='text-3xl'>Editar Enfermedad</h5>}
            open={modalForm}
            confirmLoading={true}
            onCancel={handleCloseModal}
            centered
            footer={null}
            maskClosable={false}
            className="custom-modal-form"
        >
            {loadingGetId ? (
                <div className="modal-content max-w-5xl p-5 h-[inherit]">
                    <Form
                        name='Edit Report'
                        style={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%' }}
                        onFinish={onFinish}
                        initialValues={{
                            disease: diseaseSelected?.name,
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
                                    <Input />
                                </Form.Item>
                            </div>
                            {/* VARIANTES */}
                            <div className="flex flex-col gap-5" style={{ flexGrow: 1 }}>
                                {variantes.map((variante) => (
                                    <div key={variante.id}>
                                        <div className='flex flex-col gap-5 py-3 w-full'>
                                            <h4 className='text-lg font-semibold'>VARIANTE: {variante.name}</h4>
                                            <div className='flex flex-col gap-5'>
                                                <div className='flex flex-col gap-5 w-full'>
                                                    <div className='flex gap-5 w-full h-16'>
                                                        <Form.Item
                                                            label="Nombre de la variante"
                                                            layout="vertical"
                                                            labelCol={{ span: 24 }}
                                                            style={{ width: '100%' }}
                                                        >
                                                            <Input
                                                                value={variante.name || ''}
                                                                onChange={(e) => handleVariantChange(variante.id, 'name', e.target.value)}
                                                                placeholder="Escribe el nombre de la variante"
                                                            />
                                                        </Form.Item>
                                                    </div>
                                                    <div className='flex gap-5 w-full h-16'>
                                                        <Form.Item
                                                            label="Descripción"
                                                            layout="vertical"
                                                            labelCol={{ span: 24 }}
                                                            style={{ width: '100%' }}
                                                        >
                                                            <Input
                                                                value={variante.description || ''}
                                                                onChange={(e) => handleVariantChange(variante.id, 'description', e.target.value)}
                                                                placeholder="Escribe una descripción"
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
                                                                rules={[{ required: true, message: `Debes ingresar el paso ${step} de la Variante #${variante.id}` }]}
                                                            >
                                                                <Input
                                                                    placeholder={`${step}`}
                                                                    value={variante.treatment[step]}
                                                                    onChange={(e) => handleTreatmentChange(variante.id, step, e.target.value)}
                                                                />
                                                            </Form.Item>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className='flex w-44'>
                                                    {/* {variantes.length > 1 &&
                                                    <Button danger onClick={() => eliminarUltimaVariante(variante.id)}>
                                                        Eliminar Variante #{variante.id}
                                                    </Button>
                                                } */}
                                                    {variantes.length > 1 &&
                                                        <Button onClick={() => showDeleteConfirm(variante.id, variante.name)} danger>
                                                            Eliminar Variante {variante.name}
                                                        </Button>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                            </div>
                        </div>

                        <div className={`flex w-full justify-end`}>
                            <Form.Item className='w-fit'>
                                <Button type="dashed" block onClick={agregarVariante}>
                                    + Agregar Variante
                                </Button>
                            </Form.Item>
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
                                        loading={isSaving}
                                        onClick={() => setAction('save')}>

                                        Guardar
                                    </Button>
                                </Form.Item>
                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        size='large'
                                        className='w-full'
                                        loading={isSavingAndClosing}
                                        //loading={loading}
                                        onClick={() => setAction('saveAndClose')}>

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
            ) : !loadingGetId ?
                <div className='flex justify-center items-center w-full h-full'>
                    <div className="spinner">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
                    </div>
                </div>
                : !loadingGetId && errorSearchUser ? (
                    <div className='flex justify-center items-center w-full h-full'>
                        Error al obtener la enfermedad, vuelve a intentarlo
                    </div>
                ) : null}
        </Modal>
    );
};

export default FromEditDisease;
