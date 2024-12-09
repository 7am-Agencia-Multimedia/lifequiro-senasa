'use client'

import React, { useEffect, useState } from 'react';
import { LikeOutlined, LogoutOutlined, SnippetsOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import Image from 'next/image';
import { StateAuthInterface, useAuthStore } from '@/store/useAuthStore';
import { useLogout } from '@/hooks/useLogout';
import { useRouter } from 'next/navigation';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

type Props = {
    children: React.ReactNode,
}

const SideBar: React.FC<Props> = ({ children }) => {
    // AUTH
    const resetAuth = useAuthStore((state: StateAuthInterface) => state.resetAuth)
    const auth = useAuthStore();
    const router = useRouter();
    const logout = useLogout(resetAuth);
    const handleLogout = () => {
        logout();
    };

    function getItem(
        label: React.ReactNode,
        key: React.Key,
        icon?: React.ReactNode,
        onClick?: () => void,
        children?: MenuItem[],
    ): MenuItem {
        if (key === '2' && !auth.authenticated) {
            return {
                key,
                icon,
                children,
                label,
                disabled: true,
            };
        }
        return {
            key,
            icon,
            children,
            label,
            onClick,
        };
    }

    const items: MenuItem[] = [
        getItem('Lista de reportes', '1', <i className="fa-solid fa-print"></i>),
    ];

    const bottomItems: MenuItem[] = [
        getItem('Cerrar Sesión', '2',  <i className="fa-solid fa-left-from-bracket"></i>, handleLogout),
    ];

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
    const [selectedKey, setSelectedKey] = useState<string>('1');
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
                {collapsed ? (
                    <div className='relative w-full h-12'>
                        <Image src={'/favicon.png'} alt='Logo Lifequiro' fill priority className='object-contain px-5 ' />
                    </div>
                ) : (
                    <div className='relative w-full h-12'>
                        <Image src={'/logo_white.webp'} alt='Logo Lifequiro' fill priority className='object-contain px-5' />
                    </div>
                )}
                <div className='h-12 w-full' />
                <div className='flex flex-col justify-between h-[calc(100vh-12rem)]'>
                    <Menu
                        theme="dark"
                        selectedKeys={[selectedKey]}
                        mode="inline"
                        items={items}
                        className='flex flex-col px-3'
                    />

                    <Menu
                        theme="dark"
                        mode="inline"
                        items={bottomItems}
                        className='flex flex-col px-3'
                    />
                </div>
            </Sider>
            <Layout className='py-5'>
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
            </Layout>
        </Layout>
    ) : null;
};

export default SideBar;
