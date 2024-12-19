'use client'

import React, { useState, useEffect } from 'react';
import { Layout, Menu, Modal, notification, theme } from 'antd';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Image from 'next/image';
import ListReports from './ListReports';
import PrintedReports from './PrintedReports';
import { useLogout } from '@/hooks/useLogout';
import AddDisease from './AddDisease';

const { Content, Sider } = Layout;

const items = [
    { label: 'Lista de reportes', key: 'report-list', icon: <i className="fa-solid fa-file"></i>, onClick: () => console.log('click')},
    { label: 'Reportes impresos', key: 'print-report', icon: <i className="fa-solid fa-print"></i> },
    { label: 'Enfermedades', key: 'disease', icon: <i className="fa-solid fa-notes-medical"></i> },
];

const LogoutButton = [
    { label: 'Cerrar Sesión', key: 'logout', icon: <i className="fa-solid fa-left-from-bracket"></i> },
];

const SideBar: React.FC = () => {

    const params = new URLSearchParams(document.location.search)
    const page = params.get('page')

    const auth = useAuthStore();
    const resetAuth = useAuthStore((state) => state.resetAuth);
    const router = useRouter();
    const pathname = usePathname();
    const currentSearchParams = useSearchParams();
    const [collapsed, setCollapsed] = useState(false);
    const [selectedKey, setSelectedKey] = useState<string>(page || 'report-list');
    //const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
    const logout = useLogout(resetAuth);


    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    useEffect(() => {
        const checkAuth = () => {
            if (!auth.loading && !auth.authenticated) {
                router.push('/');
            }
        };
        checkAuth();
    }, [auth.loading, auth.authenticated, router])

    const handleMenuSelect = (e: { key: string }) => {
        if (e.key === 'logout') {
            logout();
            window.location.href = '/';
        } else {
            setSelectedKey(e.key);
            handleUpdateParams(e.key)
            console.log(e.key) 
        }
        
    };

    const handleUpdateParams = (page:string) => {
        const updateSearchParams = new URLSearchParams(currentSearchParams?.toString());
        updateSearchParams.set('page', page);
        router.push(`${pathname}?${updateSearchParams.toString()}`);
    }

    const renderContent = () => {
        switch (selectedKey) {
            case 'report-list':
                return <ListReports status={0} />;

            case 'print-report':
                return <PrintedReports status={1} />;

            case 'disease':
                return <AddDisease />;
            default:
                return <div>Select an option</div>;
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
                width={250}
                collapsedWidth={80}
                className="py-10"
                breakpoint={'md'}
            >
                <div className="demo-logo-vertical" />
                {collapsed ? (
                    <div className="relative w-full h-12">
                        <Image src={'/favicon.png'} alt="Logo Lifequiro" fill priority className="object-contain px-5 " />
                    </div>
                ) : (
                    <div className="relative w-full h-12">
                        <Image src={'/logo_white.webp'} alt="Logo Lifequiro" fill priority className="object-contain px-5" />
                    </div>
                )}
                <div className="h-12 w-full" />
                <div className="flex flex-col justify-between h-[calc(100vh-12rem)]">
                    <Menu
                        theme="dark"
                        selectedKeys={[selectedKey]}
                        mode="inline"
                        items={items}
                        onSelect={handleMenuSelect}
                        onClick={(e) => console.log(e) }
                        className='px-2'
                    />
                    <Menu
                        theme="dark"
                        mode="inline"
                        items={LogoutButton}
                        onSelect={handleMenuSelect}
                    />
                </div>
            </Sider>
            <Layout className="py-5">
                <Content style={{ margin: '0 16px' }}>
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        {renderContent()}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default SideBar;
