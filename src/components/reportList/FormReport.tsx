'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Button, DatePicker, Form, Input, InputNumber, Select, Modal, Switch, Divider, Space } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import axios from 'axios';
import { CreateReportTypes, Disease, NewVariant, ReportUser, userData, Variant } from '@/utils/types';
import { useAuthStore } from '@/store/useAuthStore';
import { PlusOutlined } from '@ant-design/icons';

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
    diseases: Disease[],
    setDiseases: React.Dispatch<React.SetStateAction<Disease[]>>;
    setLastReport: React.Dispatch<React.SetStateAction<ReportUser | undefined>>;
    setSuccessReport: React.Dispatch<React.SetStateAction<boolean>>;
    successReport: boolean;
}

const { Option } = Select;
const FormReport = ({ modalForm, showModalForm, userData, clearModal, diseases, setDiseases, setLastReport, setSuccessReport, successReport }: Props) => {

    console.log(diseases)
    // VARIABLES
    const [form] = Form.useForm();
    const [secondaryDiseases, setSecondaryDiseases] = useState<Disease[]>([]);

    // SELECTED DISEASES
    const [nameDiseaseSelected, setNameDiseaseSelected] = useState('')
    const [nameDiseaseSelectedSecond, setNameDiseaseSelectedSecond] = useState('')
    const [nameVariantSelected, setNameVariantSelected] = useState('')
    const [nameVariantSelectedSecond, setNameVariantSelectedSecond] = useState('')

    const [selectedDisease, setSelectedDisease] = useState(null);
    const [selectedDiseaseSecundary, setSelectedDiseaseSecundary] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedVariantSecundary, setSelectedVariantSecundary] = useState(null);
    const [treatment, setTreatment] = useState<string[]>([
        "",
        "",
        "",
        "",
        ""
    ]);
    const [historyDisease, setHistoryDisease] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [disabledInputs, setDisabledInputs] = useState(treatment.map(() => false));
    const [showSecundaryDisease, setShowSecundaryDisease] = useState(false);

    // MEDICOS PROVISORIO
    const [medicandCenters, setMedicandCenters] = useState({
        center: "Life Quiro Spine Rehabilitation Center",
        centercode: 837345,
        doctors: [
            {
                name: "Dr. Jensen Malcoldn",
                specialty: "Fisiatra"
            },
            {
                name: "Dr. Nehemias Lopez Polanco",
                specialty: "Ortopeda"
            }
        ]
    })

    // RESET FORM
    useEffect(() => {
        if (!modalForm) {
            form.resetFields();
        }
    }, [modalForm, form]);

    const handleCloseModal = () => {
        form.resetFields()
        clearModal()
        setTreatment([
            "",
            "",
            "",
            "",
            ""
        ]);
        setHistoryDisease('')
    }

    const handleResetForm = () => {
        form.resetFields()
    }

    // CAMBIO DE ENFERMEDAD PRIMARIA
    const handleDiseaseChange = (value: any,) => {
        setSelectedDisease(value);
        setSelectedVariant(null);
        setTreatment([
            "",
            "",
            "",
            "",
            ""
        ]);
        const selectedDisease = diseases.find(disease => disease.id === value);
        setNameDiseaseSelected(selectedDisease ? selectedDisease.name : '');
    };

    // CAMBIO DE VARIANTE PRIMARIA
    const handleVariantChange = (value: any) => {
        console.log(value);
        setSelectedVariant(value);

        const selectedDiseaseObj = diseases.find(disease => disease.id === selectedDisease);

        if (selectedDiseaseObj) {
            const selectedVariantObj = selectedDiseaseObj.variants.find(variant => variant.id === value);

            if (selectedVariantObj) {
                const variantName = selectedVariantObj.name;
                setNameVariantSelected(variantName);

                let treatmentArray = [];

                if (typeof selectedVariantObj.treatment === 'string') {
                    treatmentArray = selectedVariantObj.treatment.split('\n');
                } else if (Array.isArray(selectedVariantObj.treatment)) {
                    treatmentArray = selectedVariantObj.treatment;
                } else if (typeof selectedVariantObj.treatment === 'object') {
                    treatmentArray = Object.values(selectedVariantObj.treatment);
                }
            
                if (treatmentArray.length < 5) {
                    treatmentArray = ["", "", "", "", ""];
                }

                setTreatment(treatmentArray);
                setHistoryDisease(selectedVariantObj.description);
            }
        }
    };

    // CAMBIO DE TRATAMIENTO
    const handleChangeTreatment = (index: any, value: any) => {
        const updatedTreatment = [...treatment];
        updatedTreatment[index] = value || '';  // Actualiza el valor del paso específico
        setTreatment(updatedTreatment);

        if (selectedDisease && selectedVariant) {
            // Convierte el tratamiento actualizado en una cadena de texto con saltos de línea
            const updatedTreatmentText = updatedTreatment.join('\n');
            updateDisease(selectedDisease, 'treatment', updatedTreatmentText);
        }
    };


    // HABILITAR - DESHABILITAR INPUTS
    const toggleDisable = (index: any) => {
        setDisabledInputs(prevState => {
            const newState = [...prevState];
            newState[index] = !newState[index];

            if (newState[index]) {
                const newTreatment = [...treatment];
                newTreatment[index] = '';
                setTreatment(newTreatment);
            }
            return newState;
        });
    };

    // CAMBIO DE HISTORIA DE LA ENFERMEDAD
    const handleChangeHistoryDisease = (event: any) => {
        setHistoryDisease(event.target.value);
        if (selectedDisease && selectedVariant) {
            updateDisease(selectedDisease, 'description', event.target.value)
        }
    };


    const [nameDisease, setNameDisease] = useState('');
    const [addDisease, setAddDisease] = useState('');
    const inputRef = useRef(null);
    const [newVariantName, setNewVariantName] = useState('');


    const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNameDisease(e.target.value);
        setAddDisease(e.target.value)
    };

    // AGREGAR NUEVA ENFERMEDAD
    const addItem = () => {
        if (nameDisease) {
            const newItem: Disease = {
                id: Date.now().toString(),
                name: nameDisease,
                //created_at: new Date().toISOString(),
                //updated_at: new Date().toISOString(),
                variants: []
            };
            setDiseases([...diseases, newItem]);
            setNameDisease('');
        }
    };

    const onVariantNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewVariantName(e.target.value);
    };

    // AGREGAR NUEVA VARIANTE
    const addVariant = () => {
        if (newVariantName && selectedDisease) {
            const newVariant: NewVariant = {
                id: Date.now().toString(),
                disease_id: selectedDisease,
                name: newVariantName,
                description: historyDisease,
                treatment: treatment,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            setDiseases(prevDiseases =>
                prevDiseases.map(disease =>
                    disease.id === selectedDisease
                        ? {
                            ...disease,
                            variants: [...disease.variants, newVariant]
                        }
                        : disease
                )
            );
            setNewVariantName('');
        }
    };


    // ACTUALIZAR ENFERMEDAD
    const updateDisease = (id: number | string, key: string, value: string) => {
        const updateDiseases = diseases.map(diseases => {
            if (diseases.id === id) {
                return {
                    ...diseases,
                    variants: diseases.variants.map(variant => {
                        return {
                            ...variant,
                            [key]: value,
                        }
                    })
                };
            }
            return diseases;
        })
        setDiseases(updateDiseases)

    }

    //SECOND DISEASE
    useEffect(() => {
        if (showSecundaryDisease) {
            setSecondaryDiseases(diseases)
            console.log('Actualizando disease secundary')
        }
    }, [diseases])

    const addSecundaryDisease = () => {
        setSecondaryDiseases(diseases)
        setShowSecundaryDisease(true)
    }

    const handleDeleteSecundaryDisease = () => {
        setSecondaryDiseases([])
        setShowSecundaryDisease(false)
    }

    const addVariantSecundary = () => {
        if (newVariantName && selectedDiseaseSecundary) {
            const newVariant: NewVariant = {
                id: Date.now().toString(),
                disease_id: selectedDiseaseSecundary,
                name: newVariantName,
                description: historyDisease,
                treatment: treatment,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            setDiseases(prevDiseases =>
                prevDiseases.map(disease =>
                    disease.id === selectedDiseaseSecundary
                        ? {
                            ...disease,
                            variants: [...disease.variants, newVariant]
                        }
                        : disease
                )
            );

            setNewVariantName('');
        }
    };

    const handleDiseaseSecundaryChange = (value: any) => {
        setSelectedDiseaseSecundary(value);
        setSelectedVariantSecundary(null);
        const selectedDisease = secondaryDiseases.find(disease => disease.id === value);
        setNameDiseaseSelectedSecond(selectedDisease ? selectedDisease.name : '');
    };

    const handleVariantSecundaryChange = (value: any) => {
        setSelectedVariantSecundary(value);
        const selectedDiseaseObj = diseases.find(disease => disease.id === selectedDisease);
        if (selectedDiseaseObj) {

            const selectedVariantSecundaryObj = selectedDiseaseObj.variants.find(variant => variant.id === value);

            if (selectedVariantSecundaryObj) {
                const variantSecundaryName = selectedVariantSecundaryObj.name;
                setNameVariantSelectedSecond(variantSecundaryName);
            }
        }
    };


    const onFinish = async (data: CreateReportTypes) => {
        //console.log('Received values of form: ', data);

        console.log('data:', data.diseases, data.variants_names)
        console.log('state:', selectedDisease, selectedVariant)

        console.log(nameDiseaseSelected, nameVariantSelected)

        if (!selectedDisease || !selectedVariant) {
            return;
        }
        setLoading(true)

        const _diseases = []
        if (typeof selectedDisease === 'string') {
            const findDisease = diseases.find(disease => disease.id === selectedDisease)
            _diseases.push({
                disease_name: findDisease?.name,
                disease_variant_name: findDisease?.variants[0].name,
            })
        } else if (typeof selectedDisease === 'number') {
            _diseases.push({
                disease_id: selectedDisease,
                disease_variant_id: selectedVariant,
            })
        }

        if (typeof selectedDiseaseSecundary === 'string') {
            const findDisease = diseases.find(disease => disease.id === selectedDiseaseSecundary)
            _diseases.push({
                disease_name: findDisease?.name,
                disease_variant_name: findDisease?.variants[0].name,
            })
        } else if (typeof selectedDiseaseSecundary === 'number') {
            _diseases.push({
                disease_id: selectedDiseaseSecundary,
                disease_variant_id: selectedVariantSecundary,
            })
        }
        setSuccessReport(!successReport)
        try {
            const { data: response } = await axios.request({
                url: '/api/report/create',
                method: 'POST',
                data: {
                    code: data.code.toString(),
                    affiliate_id: userData ? userData.id.toString() : '',
                    affiliate_name: data.affiliate_name,
                    social_security_number: data.social_security_number,
                    age: data.age,
                    phone: data.phone.toString(),
                    study_center: data.study_center,
                    procedure_center: data.procedure_center,
                    traffic_accident: data.traffic_accident || false,
                    center_id: 1,
                    procedure_names: treatment.join('|'),
                    current_disease_history: historyDisease,
                    pathological_antecedent: data.pathological_antecedent,
                    doctor_name: data.doctor_name,
                    diseases: _diseases,
                    // disease_id: selectedDisease,
                    // disease_variant_id: selectedVariant,
                },
            });
            //console.log('unexito:', response.data)
            setLastReport(response.data)
            
        } catch (error) {
            console.log(error);
        } finally {
            form.resetFields()
            setLoading(false);
            showModalForm();
            setTreatment([
                "",
                "",
                "",
                "",
                ""
            ]);
            setHistoryDisease('')
        }
    };

    console.log(treatment)

    return (
        <Modal
            title={<h5 className='text-3xl'>Crear Reporte</h5>}
            open={modalForm}
            confirmLoading={true}
            onCancel={handleCloseModal}
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
                    form={form}
                    initialValues={{
                        //doctorName: auth,
                        code: medicandCenters.centercode,
                        affiliate_name: userData?.firstname && userData?.lastname ? `${userData.firstname} ${userData.lastname}` : 'no-data',
                        idCard: userData?.document_no || "no-data",
                        social_security_number: userData?.social_id || "no-data",
                        age: userData?.age || 0,
                        phone: userData?.phone || 1234567891,
                        gender: userData?.gender || 'no-data',
                        traffic_accident: false,
                        //step_1: treatment[0],
                    }}>
                    <div className='flex flex-col'>
                        <div className='w-full flex justify-end'>
                            <button onClick={handleResetForm} className=''><i className="fa-duotone fa-solid fa-rotate cursor-pointer hover:text-blue-500"></i></button>
                        </div>
                        <div className='flex gap-5 w-full h-16'>
                            <Form.Item
                                label="Nombre del médico"
                                layout="vertical"
                                labelCol={{ span: 24 }}
                                name="doctor_name"
                                rules={[{ required: true, message: 'Seleccione un médico' }]}
                                style={baseStyle}
                            >
                                <Select style={{ width: '100%', maxWidth: '244.5px' }} placeholder={'Seleccione un médico'}>
                                    {medicandCenters.doctors.map((doctor, index) => (
                                        <Option key={index} value={doctor.name}>{doctor.name} | {doctor.specialty}</Option>
                                    ))}
                                </Select>
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
                    <div className='flex gap-5 w-full h-16'>
                        <Form.Item
                            label="Centro de estudio"
                            layout="vertical"
                            labelCol={{ span: 24 }}
                            name="study_center"
                            rules={[{ required: true, message: 'Seleccione un centro' }]}
                            style={baseStyle}
                        >
                            <Select style={{ width: '100%', maxWidth: '244.5px' }} placeholder={'Seleccione un centro'}>
                                <Option value={medicandCenters.center}>{medicandCenters.center}</Option>
                                <Option value="demo2">Demo 2</Option>
                                <Option value="demo3">Demo 3</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Centro de procedimiento"
                            layout="vertical"
                            labelCol={{ span: 24 }}
                            name="procedure_center"
                            rules={[{ required: true, message: 'Seleccione un centro' }]}
                            style={baseStyle}
                        >
                            <Select style={{ width: '100%', maxWidth: '244.5px' }} placeholder={'Seleccione un centro'}>
                                <Option value={medicandCenters.center}>{medicandCenters.center}</Option>
                                <Option value="demo2">Demo 2</Option>
                                <Option value="demo3">Demo 3</Option>
                            </Select>
                        </Form.Item>
                    </div>
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
                    {/* ENFERMEDAD Y VARIANTE */}
                    <div className='flex gap-5 w-full h-16'>
                        <Form.Item
                            label="Seleccione enfermedad tratante"
                            layout="vertical"
                            labelCol={{ span: 24 }}
                            name="diseases"
                            rules={[{ required: true, message: 'Seleccione una enfermedad' }]}
                            style={baseStyle}
                        >
                            <Select
                                style={{ width: '100%', maxWidth: '244.5px' }}
                                placeholder="Seleccione una enfermedad"
                                onChange={handleDiseaseChange}
                                showSearch
                                filterOption={(input, option) => {
                                    const optionLabel = Array.isArray(option?.children)
                                        ? option?.children[0]
                                        : option?.children || '';

                                    return optionLabel.toLowerCase().includes(input.toLowerCase());
                                }}
                                dropdownRender={(menu) => (
                                    <>
                                        {menu}
                                        <Divider style={{ margin: '8px 0' }} />
                                        <Space style={{ padding: '0 8px 4px' }}>
                                            <Input
                                                placeholder="Escriba el nombre de la enfermedad"
                                                ref={inputRef}
                                                value={nameDisease}
                                                onChange={onNameChange}
                                                onKeyDown={(e) => e.stopPropagation()}
                                            />
                                            <Button type="text" icon={<PlusOutlined />} onClick={addItem}>

                                            </Button>
                                        </Space>
                                    </>
                                )}
                            >
                                {diseases.map((value) => (
                                    <Select.Option key={value.id} value={value.id}>
                                        {value.name}
                                    </Select.Option>
                                ))}
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
                            <Select
                                style={{ width: '100%', maxWidth: '244.5px' }}
                                onChange={handleVariantChange}
                                placeholder={'Seleccione una variante'}
                                showSearch
                                filterOption={(input, option) => {
                                    const optionLabel = Array.isArray(option?.children)
                                        ? option?.children[0]
                                        : option?.children || '';
                                    return optionLabel.toLowerCase().includes(input.toLowerCase());
                                }}
                                dropdownRender={(menu) => (
                                    <>
                                        {menu}
                                        <Divider style={{ margin: '8px 0' }} />
                                        <Space style={{ padding: '0 8px 4px' }}>
                                            <Input
                                                placeholder="Escriba el nombre de la variante"
                                                ref={inputRef}
                                                value={newVariantName}
                                                onChange={onVariantNameChange}
                                                onKeyDown={(e) => e.stopPropagation()}
                                            />
                                            <Button type="text" icon={<PlusOutlined />} onClick={addVariant} />
                                        </Space>
                                    </>
                                )}
                            >
                                {diseases
                                    .find(disease => disease.id === selectedDisease)
                                    ?.variants?.map(variant => {
                                        return (
                                            <Option key={variant.id} value={variant.id}>
                                                {variant.name}
                                            </Option>
                                        );
                                    })}
                            </Select>
                        </Form.Item>
                    </div>
                    {showSecundaryDisease && (
                        <div className='flex gap-5 w-full h-16'>
                            <Form.Item
                                label="Seleccione enfermedad secundaria"
                                layout="vertical"
                                labelCol={{ span: 24 }}
                                name="diseasesSecundary"
                                rules={[{ required: false, message: 'Seleccione una enfermedad' }]}
                                style={baseStyle}
                            >
                                <Select
                                    style={{ width: '100%', maxWidth: '244.5px' }}
                                    placeholder="Seleccione una enfermedad"
                                    onChange={handleDiseaseSecundaryChange}
                                    showSearch
                                    filterOption={(input, option) => {
                                        const optionLabel = Array.isArray(option?.children)
                                            ? option?.children[0]
                                            : option?.children || '';

                                        return optionLabel.toLowerCase().includes(input.toLowerCase());
                                    }}
                                    dropdownRender={(menu) => (
                                        <>
                                            {menu}
                                            <Divider style={{ margin: '8px 0' }} />
                                            <Space style={{ padding: '0 8px 4px' }}>
                                                <Input
                                                    placeholder="Escriba el nombre de la enfermedad"
                                                    ref={inputRef}
                                                    value={nameDisease}
                                                    onChange={onNameChange}
                                                    onKeyDown={(e) => e.stopPropagation()}
                                                />
                                                <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                                                </Button>
                                            </Space>
                                        </>
                                    )}
                                >
                                    {secondaryDiseases.map((value) => (
                                        <Select.Option key={value.id} value={value.id}>
                                            {value.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="Seleccione la variante"
                                layout="vertical"
                                labelCol={{ span: 24 }}
                                name="variants_names_secundary"
                                rules={[{ required: false, message: 'Seleccione una variante' }]}
                                style={baseStyle}
                            >
                                <Select
                                    style={{ width: '100%', maxWidth: '244.5px' }}
                                    onChange={handleVariantSecundaryChange}
                                    placeholder={'Seleccione una variante'}
                                    showSearch
                                    filterOption={(input, option) => {
                                        const optionLabel = Array.isArray(option?.children)
                                            ? option?.children[0]
                                            : option?.children || '';
                                        return optionLabel.toLowerCase().includes(input.toLowerCase());
                                    }}
                                    dropdownRender={(menu) => (
                                        <>
                                            {menu}
                                            <Divider style={{ margin: '8px 0' }} />
                                            <Space style={{ padding: '0 8px 4px' }}>
                                                <Input
                                                    placeholder="Escriba el nombre de la variante"
                                                    ref={inputRef}
                                                    value={newVariantName} // Usamos el estado `newVariantName`
                                                    onChange={onVariantNameChange}
                                                    onKeyDown={(e) => e.stopPropagation()} // Prevenir que la tecla Enter cierre el menú
                                                />
                                                <Button type="text" icon={<PlusOutlined />} onClick={addVariantSecundary} />
                                            </Space>
                                        </>
                                    )}
                                >
                                    {secondaryDiseases
                                        .find(disease => disease.id === selectedDiseaseSecundary)
                                        ?.variants?.map(variant => {
                                            return (
                                                <Option key={variant.id} value={variant.id}>
                                                    {variant.name}
                                                </Option>
                                            );
                                        })}
                                </Select>
                            </Form.Item>
                        </div>
                    )}

                    {secondaryDiseases.length > 0 ? (
                        <div className="flex justify-end items-center w-full">
                            <div>
                                <Button danger onClick={handleDeleteSecundaryDisease}>
                                    - Elimiar Enfermedad Secundaria
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-end items-center w-full">
                            <div className="w-48">
                                <Button type="dashed" block onClick={addSecundaryDisease}>
                                    + Enfermedad Secundaria
                                </Button>
                            </div>
                        </div>
                    )}


                    {/* TEXT AREA */}
                    <div className='flex flex-col gap-5 w-full'>
                        <div className='flex flex-col gap-5'>
                            <div className='flex flex-col gap-2'>
                                <p>Procedimiento a seguir</p>
                                <div className="flex flex-col gap-2">
                                    {treatment.map((step, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            {/* Input */}
                                            <Input
                                                style={{ width: '100%' }}
                                                value={step}
                                                placeholder={disabledInputs[index] ? `Procedimiento deshabilitado` : `Paso ${index + 1}`}
                                                onChange={(e) => handleChangeTreatment(index, e.target.value)}
                                                disabled={disabledInputs[index]}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => toggleDisable(index)}
                                                className="bg-neutral-100 hover:bg-neutral-200 transition-colors duration-300 px-2 py-1 text-sm rounded w-28"
                                            >
                                                {disabledInputs[index] ? 'Habilitar' : 'Deshabilitar'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className='flex flex-col gap-2'>
                                <p>Historia de la enfermedad</p>
                                <TextArea
                                    rows={4}
                                    value={historyDisease}
                                    onChange={handleChangeHistoryDisease}
                                />
                            </div>
                        </div>
                        <Form.Item
                            label="Antecedente patológico"
                            layout="vertical"
                            labelCol={{ span: 24 }}
                            name="pathological_antecedent"
                            rules={[{ required: true, message: 'Ingrese el antecedente patológico' }]}
                            className='min-h-28'
                        >
                            <TextArea rows={4} />
                        </Form.Item>
                        {/* BUTTON */}
                        <div className='flex w-full justify-between gap-5 pt-5'>
                            <Form.Item>
                                <Button loading={loading} type="primary" htmlType="submit" size='large' className='w-full'>
                                    Crear Reporte
                                </Button>
                            </Form.Item>
                            <Button onClick={handleCloseModal} color="default" variant="filled" htmlType="button" size='large' className='w-fit'>
                                Cancelar
                            </Button>
                        </div>
                    </div>


                </Form>
            </div>
        </Modal>
    );
}

export default FormReport;
