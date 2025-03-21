
'use client'
import React, { useState } from 'react'
import { EyeInvisibleOutlined, EyeTwoTone, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Flex } from 'antd';
import Image from 'next/image';
import { StateAuthInterface, useAuthStore } from '@/store/useAuthStore';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface LoginFields {
    email: string;
    password: string;
}
const Login = () => {


    // const onFinish = (values: any) => {
    //     console.log('Received values of form: ', values);
    // };

    const setAuthenticated = useAuthStore((state: StateAuthInterface) => state.setAuthenticated);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('')
    
    async function onSubmit(data: LoginFields) {
        setLoading(true)
        setError(false)
        try {
            const { data: res } = await axios.request({
                url: '/api/user/login',
                method: 'POST',
                data: {
                    email: data.email,
                    password: data.password,
                }
            });
            setAuthenticated(res.data);
            window.location.href = '/admin';
        } catch (error: unknown) {
            //console.log(error.message);
            setError(true)
            setLoading(false)

            if (axios.isAxiosError(error)) {

                console.log(error.response) 
                if (error.response) {
                    const errorMessage = error.response?.data?.message === 'Invalid password'
                        ? 'Contraseña incorrecta, vuelve a intentarlo'
                        : error.response?.data?.message === 'Invalid email' ? 'Email inválido, vuelve a intentarlo.' : 'Error al iniciar sesión, vuelve a intentarlo.';

                        setErrorMessage(errorMessage)
                } else {
                    console.log('Error desconocido en la petición');
                    const errorMessage = 'Error al iniciar sesión, vuelve a intentarlo.'
                    setErrorMessage(errorMessage)
                }
            } else {
                console.log('Error desconocido');
                alert('Error desconocido');
            }
        }
    }

    const onFinish = (data: LoginFields) => {
        //console.log('Received values of form: ', data);
        onSubmit(data);
    };

    return (
        <div className='flex flex-col justify-center items-center gap-10 px-5 w-full'>
            <div className='flex flex-col justify-center items-center w-full gap-10'>
                <div className='relative w-full h-24'>
                    <Image src={'/logo_color.webp'} alt='Logo Lifequiro' fill className='object-contain' priority />
                </div>
                <div className='flex flex-col gap-2 justify-center items-center'>
                    {/* <p className='text-2xl md:text-3xl font-semibold text-center'>Acceda a su cuenta</p> */}
                    <p className='text-xs text-neutral-400'>Bienvenido, por favor ingrese sus credenciales para continuar.</p>
                </div>
                <Form
                    name="login"
                    initialValues={{ remember: true }}
                    style={{ maxWidth: 360 }}
                    onFinish={onFinish}
                    className='w-full flex flex-col gap-5'
                >
                    <div className='flex flex-col'>
                        <Form.Item
                            name="email"
                            rules={[
                                { type: 'email', message: 'Debes ingresar un formato válido para email', },
                                { required: true, message: 'Introduzca su dirección de correo electrónico', },
                            ]}
                        >
                            <Input prefix={<UserOutlined />} type='email' placeholder="Email" size='large' />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Introduzca su contraseña' },
                                    { min: 8, message: 'La contraseña debe tener al menos 8 caracteres' }
                            ]}
                        >
                            <Input.Password
                                placeholder="Password"
                                size='large'
                                prefix={<LockOutlined />}
                                type="password"
                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            />
                        </Form.Item>
                        {error ? (
                            <div>
                                <p className='text-xs text-red-500 text-center'>{errorMessage}</p>
                            </div>
                        ) : null}
                    </div>
                    {/* <Form.Item>
                    <Flex justify="space-between" align="center">
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>
                        <a href="">Forgot password</a>
                    </Flex>
                </Form.Item> */}

                    <Form.Item>
                        <Button block type="primary" htmlType="submit" size='large' className='w-full' loading={loading}>
                            Inicia sesión
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default Login