'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Button, DatePicker, Form, Input, InputNumber, Select, Modal, Switch, Divider, Space } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import axios from 'axios';
import { AddDisease, CreateReportTypes, Disease, DiseaseTypes, NewVariant, ReportUser, userData, Variant } from '@/utils/types';
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
    successReport?: boolean;
}

const { Option } = Select;
const FormReport = ({ modalForm, showModalForm, userData, clearModal, diseases, setDiseases, setLastReport, setSuccessReport, successReport }: Props) => {

    // VARIABLES
    const [form] = Form.useForm();
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
    const [selectedDiseases, setSelectedDiseases] = useState<AddDisease[]>([{ id: Date.now().toString(), name: '' }]);

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

    const handleChangeTreatment = (index: any, value: any) => {
        const updatedTreatment = [...treatment];
        updatedTreatment[index] = value || ''; 
        setTreatment(updatedTreatment);

        if(selectedDiseases.length === 0) return;
        updateDisease(selectedDiseases[0].id, 'treatment', updatedTreatment);
    };

    const handleChangeHistoryDisease = (event: any) => {
        setHistoryDisease(event.target.value);
        
        if (selectedDiseases.length === 0) return;
        updateDisease(selectedDiseases[0].id, 'description', event.target.value)
    };

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

    // ACTUALIZAR ENFERMEDAD
    const updateDisease = (id: number | string, key: string, value: any) => {
        const updateDiseases = selectedDiseases.map(d => {
            if (d.id === id) {
                const body = {
                    ...d
                }
                if(d.variant) {
                    body.variant = {
                        ...d.variant,
                        [key]: value
                    }
                }
                return body;
            }
            return d;
        })
        setSelectedDiseases(updateDiseases)

    }

    const addNewDisease = () => {
        const newDisease = { id: Date.now().toString(), name: '' };
        setSelectedDiseases(current => ([...current, newDisease]));
    }

    const onFinish = async (data: CreateReportTypes) => {

        const findDiseaseWithoutVariant = selectedDiseases.filter(d => !d.variant?.name);
        if (findDiseaseWithoutVariant.length > 0) {
            return;
        }
        setLoading(true)

        const _diseases: any[] = []
        selectedDiseases.forEach(d => {
            if(typeof d.id === 'string') {
                if(!d.name || !d.variant?.name) return;
                _diseases.push({
                    disease_name: d.name,
                    disease_variant_name: d.variant.name,
                })
            } else if (typeof d.id === 'number') {
                if (!d.id || !d.variant?.id) return;
                _diseases.push({
                    disease_id: d.id,
                    disease_variant_id: d.variant.id,
                })
            }
        })
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
            setLastReport(response.data)

        } catch (error) {
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
    console.log(selectedDiseases)

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
                    {selectedDiseases.map((d, i) => (
                        <DiseaseRow
                            key={i}
                            i={i}
                            disease={d}
                            diseases={diseases}
                            setDiseases={setDiseases}
                            selectedDiseases={selectedDiseases}
                            setSelectedDiseases={setSelectedDiseases}
                            treatment={{ get: treatment, set: setTreatment }}
                            history={{ get: historyDisease, set: setHistoryDisease }}
                            resetField={(field: string) => form.resetFields([field])}
                        />
                    ))}

                    <div className="flex justify-end items-center w-full">
                        <div className="w-48">
                            <Button type="dashed" block onClick={addNewDisease}>
                                Agregar enfermedad
                            </Button>
                        </div>
                    </div>

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

type DiseaseRowType = {
    i: number;
    disease: AddDisease;
    diseases: Disease[];
    setDiseases: React.Dispatch<React.SetStateAction<Disease[]>>;
    selectedDiseases: AddDisease[];
    setSelectedDiseases: (arg0: AddDisease[]) => void;
    treatment: { get: string[]; set: (value: string[]) => void; };
    history: { get: string; set: (value: string) => void; };
    resetField: (field: string) => void;
}
function DiseaseRow({ i, disease, diseases, setDiseases, selectedDiseases, setSelectedDiseases, treatment, history, resetField }: DiseaseRowType) {

    const nameInputRef = useRef(null);
    const variantInputRef = useRef(null);

    const [nameDisease, setNameDisease] = useState('');
    const [nameVariant, setNameVariant] = useState('');

    const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNameDisease(e.target.value);
    };
    const onVariantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNameVariant(e.target.value);
    };

    const handleDiseaseChange = (id: string | number, index: number) => {
        const findDisease = diseases.find(d => d.id === id);
        if (!findDisease) return;

        const updatedDiseases = selectedDiseases.map((d, i) => {
            if (i === index) {
                return { id: findDisease.id, name: findDisease.name }
            }
            return d;
        });
        setSelectedDiseases(updatedDiseases);
        resetField(`variant-${i}`)
    };

    // CAMBIO DE VARIANTE PRIMARIA
    const handleVariantChange = (disease_id: string | number, variant_id: string | number, index: number) => {
        const disease = diseases.find(disease => disease.id === disease_id);
        if (!disease) return;

        const findVariant = disease.variants.find(variant => variant.id === variant_id);
        if (!findVariant) return;

        let treatmentArray: string[] = [];

        if (Array.isArray(findVariant.treatment)) {
            treatmentArray = findVariant.treatment;
        } else if (typeof findVariant.treatment === 'object') {
            treatmentArray = Object.values(findVariant.treatment);
        }

        if (treatmentArray.length < 5) {
            treatmentArray = ["", "", "", "", ""];
        }

        
        if (index === 0) {
            treatment.set(treatmentArray);
            history.set(findVariant.description);
            const updatedDiseases = selectedDiseases.map(d => {
                if (d.id === disease_id) {
                    return { ...d, variant: { id: findVariant.id, name: findVariant.name, treatment: treatmentArray, description: findVariant.description } }
                }
                return d;
            });
            setSelectedDiseases(updatedDiseases);
            return;
        }

        const updatedDiseases = selectedDiseases.map(d => {
            if (d.id === disease_id) {
                return { ...d, variant: { id: findVariant.id, name: findVariant.name } }
            }
            return d;
        });
        setSelectedDiseases(updatedDiseases);
    };

    const addVariant = () => {
        if (nameVariant && disease.id) {
            const newVariant: NewVariant = {
                id: Date.now().toString(),
                disease_id: disease.id,
                name: nameVariant,
                description: history.get,
                treatment: treatment.get
            };

            setDiseases((prevDiseases: Disease[]) => prevDiseases.map(d => {
                if (d.id === disease.id) {
                    return {
                        ...d,
                        variants: [...d.variants, newVariant]
                    }
                }
                return d;
            })
            );
            setNameVariant('');
        }
    };

    const addItem = () => {
        if (nameDisease) {
            const newItem: Disease = {
                id: Date.now().toString(),
                name: nameDisease,
                variants: []
            };
            setDiseases([...diseases, newItem]);
            setNameDisease('');
        }
    };

    const handleDeleteDisease = (id: string | number) => {
        if(selectedDiseases.length === 1) return;
        const updatedDiseases = selectedDiseases.filter(d => d.id !== id);
        setSelectedDiseases(updatedDiseases);
    }

    return (
        <div className={'flex flex-col gap-2'}>
            <div className='flex gap-5 w-full h-16'>
                <Form.Item
                    label="Seleccione enfermedad tratante"
                    layout="vertical"
                    labelCol={{ span: 24 }}
                    name={`disease-${i}`}
                    rules={[{ required: true, message: 'Seleccione una enfermedad' }]}
                    style={baseStyle}
                >
                    <Select
                        style={{ width: '100%', maxWidth: '244.5px' }}
                        placeholder="Seleccione una enfermedad"
                        value={disease.id}
                        onChange={(id: string | number) => handleDiseaseChange(id, i)}
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
                                        ref={nameInputRef}
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
                    name={`variant-${i}`}
                    rules={[{ required: true, message: 'Seleccione una variante' }]}
                    style={baseStyle}
                >
                    <Select
                        style={{ width: '100%', maxWidth: '244.5px' }}
                        onChange={(variant_id: string | number) => handleVariantChange(disease.id, variant_id, i)}
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
                                        ref={variantInputRef}
                                        value={nameVariant}
                                        onChange={onVariantChange}
                                        onKeyDown={(e) => e.stopPropagation()}
                                    />
                                    <Button type="text" icon={<PlusOutlined />} onClick={addVariant} />
                                </Space>
                            </>
                        )}
                    >
                        {diseases
                            .find(d => d.id === disease.id)
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
            {i !== 0 ? (
                <div className="flex justify-end items-center w-full">
                    <div>
                        <Button danger onClick={() => handleDeleteDisease(disease.id)}>
                            Elimiar Enfermedad
                        </Button>
                    </div>
                </div>
            ) : null}
        </div>
    )
}