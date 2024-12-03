'use client'

import React, { useState } from 'react';
import {
    LikeOutlined,
    SnippetsOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import { useRouter } from 'next/router';  // Importa useRouter
import Image from 'next/image';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}

const items: MenuItem[] = [
    getItem('Nueva seccion', '1', <SnippetsOutlined />),
    getItem('Test', '2', <LikeOutlined />),
    // Puedes agregar más opciones aquí
];

type Props = {
    children: React.ReactNode,
}

const SideBar: React.FC<Props> = ({ children }) => {

    const [collapsed, setCollapsed] = useState(false);
    const [selectedKey, setSelectedKey] = useState<string>('1');  // Estado para la opción seleccionada
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    // Función para manejar el cambio de opción
    const handleMenuClick = (e: any) => {
        setSelectedKey(e.key);  // Actualiza la opción seleccionada

        // Según la opción seleccionada, redirige a una página diferente
        /* if (e.key === '1') {
            router.push('/admin');  // Redirige a /admin
        } else if (e.key === '2') {
            router.push('/admin/test');  // Redirige a /admin/test
        } */
        // Puedes añadir más opciones con más condiciones si lo necesitas
    };

    // Actualiza el menú seleccionado cuando cambie la URL
    /* useEffect(() => {
        if (router.asPath === '/admin') {
            setSelectedKey('1');
        } else if (router.asPath === '/admin/test') {
            setSelectedKey('2');
        }
    }, [router.asPath]); */

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
                width={250}  // Establece el ancho cuando el Sider no está colapsado
                collapsedWidth={80}  // Establece el ancho cuando el Sider está colapsado
                className='py-10'
            >
                {/* <div className="demo-logo-vertical" /> */}
                {collapsed ? (
                    <div className='relative w-full h-12'>
                        <Image src={'/favicon.png'} alt='Logo Lifequiro' fill className='object-contain px-5' />
                    </div>
                ) : (
                    <div className='relative w-full h-12'>
                        <Image src={'/logo_white.webp'} alt='Logo Lifequiro' fill className='object-contain px-5' />
                    </div>
                )}
                <div className='h-20 w-full' />
                <Menu
                    theme="dark"
                    selectedKeys={[selectedKey]}  // Establece la opción seleccionada
                    mode="inline"
                    items={items}
                    onClick={handleMenuClick}
                    className='px-3'
                />
            </Sider>
            <Layout className='py-5'>
                {/* <Header style={{ padding: 0, background: colorBgContainer }} /> */}
                <Content style={{ margin: '0 16px' }}>
                    <div
                        className='h-full'
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        {children}
                    </div>
                </Content>
                {/* <Footer style={{ textAlign: 'center' }} />
                    Ant Design ©{new Date().getFullYear()} Created by Ant UED
                </Footer> */}
            </Layout>
        </Layout>
    );
};

export default SideBar;