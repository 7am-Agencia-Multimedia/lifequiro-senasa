import React, { useEffect, useState } from 'react';
import type { GetProp, TableProps } from 'antd';
import { Table, Button, Modal } from 'antd';
import type { SorterResult } from 'antd/es/table/interface';
import { ReportUser } from '@/utils/types';
import axios from 'axios';
import { useRouter } from 'next/navigation';

type ColumnsType<T extends object = object> = TableProps<T>['columns'];
type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;

interface DataType {
    id: number;
    affiliate_id: string;
    affiliate_name: string;
    social_security_number: string;
    phone: string;
}

interface TableParams {
    pagination?: TablePaginationConfig;
    sortField?: SorterResult<any>['field'];
    sortOrder?: SorterResult<any>['order'];
    filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
}

type Props = {
    lastReport: ReportUser | undefined;
    successReport: boolean;
    statusFiltered: 0 | 1 ;
}

const ListUsers: React.FC<Props> = ({ lastReport, successReport, statusFiltered}) => {
    const [data, setData] = useState<DataType[]>([]);
    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });

    const [reportUsers, setReportUsers] = useState<ReportUser[]>([]);
    const [hasRun, setHasRun] = useState(false);
    const [selectedUser, setSelectedUser] = useState<ReportUser | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (hasRun) return;
        async function handleGetDiseasesList() {
            try {
                const { data: res } = await axios.request({
                    method: 'GET',
                    url: '/api/report/getAllReports',
                });
                // Filtrar los reportes para que solo se muestren los que tienen status = 0
                const filteredReports = res.data.filter((report: ReportUser) => report.status === statusFiltered);
                setReportUsers(filteredReports);
                console.log(filteredReports);
            } catch (error) {
                console.error(error);
            }
        }
        handleGetDiseasesList();
        setHasRun(true);
    }, [hasRun, successReport, lastReport]);

    useEffect(() => {
        if (lastReport) {
            setReportUsers((prevReportUsers) => {
                const updatedReportUsers = [lastReport, ...prevReportUsers].filter(
                    (report) => report.status === statusFiltered // Filtrar por status === 0
                );
                const { pageSize = 10, current = 1 } = tableParams.pagination || {};
                const users = transformData(updatedReportUsers.slice((current - 1) * pageSize, current * pageSize));
                setData(users);
                return updatedReportUsers;
            });
        }
    }, [lastReport]);

    useEffect(() => {
        if (reportUsers.length > 0) {
            const { pageSize = 10, current = 1 } = tableParams.pagination || {};
            const users = transformData(reportUsers.slice((current - 1) * pageSize, current * pageSize));
            setData(users);
        }
    }, [reportUsers, tableParams.pagination?.current, tableParams.pagination?.pageSize]);

    const transformData = (reportUsers: ReportUser[]): DataType[] => {
        return reportUsers.map(user => ({
            id: user.id,
            affiliate_id: user.affiliate_id,
            affiliate_name: user.affiliate_name,
            social_security_number: user.social_security_number,
            phone: user.phone,
        }));
    };

    const handleTableChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
            sortField: Array.isArray(sorter) ? undefined : sorter.field,
        });

        const { current = 1, pageSize = 10 } = pagination ?? {};
        let filteredUsers = [...reportUsers];

        // Filtrar por affiliate_id si se aplica un filtro
        if (filters?.affiliate_id && filters.affiliate_id.length) {
            const affiliateIdFilter = filters.affiliate_id[0] as string;
            filteredUsers = filteredUsers.filter(user =>
                user.affiliate_id.includes(affiliateIdFilter)
            );
        }

        const users = transformData(filteredUsers.slice((current - 1) * pageSize, current * pageSize));
        setData(users);
    };

    const handleViewReport = async (userId: number) => {
        try {
            const selectedReport = reportUsers.find(user => user.id === userId);
            if (selectedReport) {
                const url = `/admin/view-pdf-report/${userId}`;
                const a = document.createElement('a');
                a.href = url;
                a.target = '_blank'; 
                a.rel = 'noopener noreferrer'; 
                a.click();
            }
        } catch (error) {
            console.error('Error al obtener el reporte:', error);
        }
    };

    const handlePrintReport = async (userId: number) => {
        try {
            const selectedReport = reportUsers.find(user => user.id === userId);
            if (selectedReport) {
                const url = `/admin/print-pdf-report/${userId}`;
                const a = document.createElement('a');
                a.href = url;
                a.target = '_blank'; 
                a.rel = 'noopener noreferrer'; 
                a.click();
            }
        } catch (error) {
            console.error('Error al obtener el reporte:', error);
        }
    };

    const handleCloseModal = () => {
        setSelectedUser(null);
    };

    const columns: ColumnsType<DataType> = [
        {
            title: 'ID',
            dataIndex: 'affiliate_id',
            sorter: false,
            width: '5%',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <input
                        placeholder="Buscar por ID"
                        value={selectedKeys[0] ? selectedKeys[0].toString() : ''}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                        className='outline-none py-1 border rounded-lg px-2'
                    />
                    <div>
                        <Button
                            type="primary"
                            onClick={() => {
                                confirm();
                                setTableParams({ ...tableParams, filters: { affiliate_id: selectedKeys } });
                            }}
                            icon="Buscar"
                            size="small"
                            style={{ width: 90, marginRight: 8 }}
                        >
                            
                        </Button>
                        <Button onClick={() => clearFilters?.()} size="small" style={{ width: 90 }}>
                            Resetear
                        </Button>

                    </div>
                </div>
            ),
            onFilter: (value, record) => {
                return record.affiliate_id.includes(value as string);
            },
        },
        {
            title: 'Nombre del paciente',
            dataIndex: 'affiliate_name',
            width: '20%',
        },
        {
            title: 'Número de seguridad social',
            dataIndex: 'social_security_number',
            width: '20%',
        },
        {
            title: 'Número de teléfono',
            dataIndex: 'phone',
            width: '10%',
        },
        {
            title: 'Reporte',
            key: 'action',
            width: '5%',
            render: (text, record) => (
                <Button onClick={() => handleViewReport(record.id)}>Ver</Button>
            ),
        },
        {
            title: 'Impresión',
            key: 'action',
            width: '5%',
            render: (text, record) => (
                <Button color={statusFiltered === 0 ? "primary" : "danger"} variant="outlined" onClick={() => handlePrintReport(record.id)}><i className="fa-solid fa-print"></i></Button>
            ),
        },
    ];

    return (
        <>
            <Table<DataType>
                columns={columns}
                rowKey={(record) => record.id.toString()}
                dataSource={data}
                pagination={{
                    current: tableParams.pagination?.current ?? 1,
                    pageSize: tableParams.pagination?.pageSize ?? 10,
                    total: reportUsers.length,
                }}
                loading={loading}
                onChange={handleTableChange}
            />

            <Modal
                title="Detalles del Reporte"
                open={!!selectedUser}
                onCancel={handleCloseModal}
                footer={null}
                width={600}
            >
                {selectedUser ? (
                    <div>
                    </div>
                ) : (
                    <p>Cargando...</p>
                )}
            </Modal>
        </>
    );
};

export default ListUsers;
