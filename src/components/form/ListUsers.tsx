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
}

const ListUsers: React.FC<Props> = ({ lastReport, successReport }) => {
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
                setReportUsers(res.data);
                console.log(res.data);
            } catch (error) {
                console.error(error);
            }
        }
        handleGetDiseasesList();
        setHasRun(true);
    }, [hasRun, successReport, lastReport]);

    // Si lastReport tiene contenido, agregarlo a reportUsers al principio
    useEffect(() => {
        if (lastReport) {
            setReportUsers((prevReportUsers) => {
                const updatedReportUsers = [lastReport, ...prevReportUsers]; // Colocamos el último reporte al principio
                // Actualizar los datos de la tabla después de agregar el reporte
                const { pageSize = 10, current = 1 } = tableParams.pagination || {};
                const users = transformData(updatedReportUsers.slice((current - 1) * pageSize, current * pageSize));
                setData(users);
                return updatedReportUsers;
            });
        }
    }, [lastReport]);

    // Cargar los datos cuando cambian los parámetros de la tabla
    useEffect(() => {
        if (reportUsers.length > 0) {
            const { pageSize = 10, current = 1 } = tableParams.pagination || {};
            // Mostrar los reportes en orden inverso, el más reciente primero
            const users = transformData(reportUsers.slice().reverse().slice((current - 1) * pageSize, current * pageSize));
            setData(users);
        }
    }, [reportUsers, tableParams.pagination?.current, tableParams.pagination?.pageSize]);

    // Transformar los datos de reportUsers a la estructura que espera la tabla
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

        // Recargar los datos cuando cambie el tamaño de la página o la página
        const { current = 1, pageSize = 10 } = pagination ?? {};
        const users = transformData(reportUsers.slice().reverse().slice((current - 1) * pageSize, current * pageSize));
        setData(users);
    };

    // Maneja la visualización del reporte del usuario
    const handleViewReport = async (userId: number) => {
        try {
            const selectedReport = reportUsers.find(user => user.id === userId);
            if (selectedReport) {
                router.push(`/admin/view-pdf-report/${userId}`);
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
            title: 'affiliate_id',
            dataIndex: 'affiliate_id',
            sorter: true,
            width: '5%',
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
            title: 'Acción',
            key: 'action',
            width: '10%',
            render: (text, record) => (
                <Button color="primary" variant="outlined" onClick={() => handleViewReport(record.id)}>Ver Reporte</Button>
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
                        {/* Mostrar detalles del reporte */}
                    </div>
                ) : (
                    <p>Cargando...</p>
                )}
            </Modal>
        </>
    );
};

export default ListUsers;
