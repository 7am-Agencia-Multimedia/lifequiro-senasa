import React, { useState, useEffect } from 'react';
import { Layout, Menu, theme } from 'antd';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ListReports from './ListReports';
import PrintedReports from './PrintedReports';
import { useLogout } from '@/hooks/useLogout';

const { Content, Sider } = Layout;

const items = [
    { label: 'Lista de reportes', key: '1', icon: <i className="fa-solid fa-file"></i> },
    { label: 'Reportes impresos', key: '2', icon: <i className="fa-solid fa-print"></i> },
];

const LogoutButton = [
    { label: 'Cerrar Sesión', key: 'logout', icon: <i className="fa-solid fa-left-from-bracket"></i> },
];

const SideBar: React.FC = () => {
    const resetAuth = useAuthStore((state) => state.resetAuth);
    const logout = useLogout(resetAuth);
    const auth = useAuthStore();
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);
    const [selectedKey, setSelectedKey] = useState<string>('1');
    const [logoutTriggered, setLogoutTriggered] = useState(false);

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
    }, [auth.loading, auth.authenticated, router]);

    useEffect(() => {
        if (logoutTriggered) {
            router.push('/');
        }
    }, [logoutTriggered, router]);

    const handleMenuSelect = (e: { key: string }) => {
        if (e.key === 'logout') {
            setLogoutTriggered(true);
            logout();
        } else {
            setSelectedKey(e.key);
        }
    };

    const renderContent = () => {
        switch (selectedKey) {
            case '1':
                return <ListReports status={0} />;
            case '2':
                return <PrintedReports status={1} />;
            default:
                return <div>Select an option</div>;
        }
    };

    return auth.authenticated ? (
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
                <div className='flex flex-col justify-between h-[calc(100vh-12rem)]'>
                    <Menu
                        theme="dark"
                        defaultSelectedKeys={['1']}
                        mode="inline"
                        items={items}
                        onSelect={handleMenuSelect}
                    />
                    <Menu
                        theme="dark"
                        defaultSelectedKeys={['1']}
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
    ) : null;
};

export default SideBar;
