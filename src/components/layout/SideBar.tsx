'use client'

import React, { useEffect, useState } from 'react';
import { LikeOutlined, SnippetsOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import Image from 'next/image';
import { StateAuthInterface, useAuthStore } from '@/store/useAuthStore';
import { useLogout } from '@/hooks/useLogout';
import { useRouter } from 'next/navigation';

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
    getItem('Lista de reportes', '1', <SnippetsOutlined />),
    //getItem('Cerrar Sesion', '2', <SnippetsOutlined/>),
    //getItem('Test', '2', <LikeOutlined />),
    // Puedes agregar más opciones aquí
];

type Props = {
    children: React.ReactNode,
}

const SideBar: React.FC<Props> = ({ children }) => {

    // AUTH
    const resetAuth = useAuthStore((state: StateAuthInterface) => state.resetAuth)
    const auth = useAuthStore();
    // const auth = {
    //     authenticated: true,
    //     loading: false
    // }
    const router = useRouter();

    const logout = useLogout(resetAuth);
    const handleLogout = () => {
        logout();
    };

    useEffect(() => {
        const checkAuth = () => {
            if (!auth.loading && !auth.authenticated) {
                router.push('/')
            }
        };
        checkAuth();
    }, [auth.loading, auth.authenticated])

    // SIDEBAR

    const [collapsed, setCollapsed] = useState(false);
    const [selectedKey, setSelectedKey] = useState<string>('1');  // Estado para la opción seleccionada
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return auth.authenticated ? (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
                width={250}
                collapsedWidth={80}
                className='py-10 relative'
                breakpoint={'md'}
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
                <div className='h-12 w-full' />
                <Menu
                    theme="dark"
                    selectedKeys={[selectedKey]}
                    mode="inline"
                    items={items}
                    //onClick={handleMenuClick}
                    className='flex flex-col h-96 px-3'
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
    ) : null
};

export default SideBar;