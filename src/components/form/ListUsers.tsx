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
}

const ListUsers: React.FC<Props> = ({lastReport}) => {

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

    // Trae la lista de usuarios con reporte desde la API
    useEffect(() => {
        if (hasRun) return;
        async function handleGetDiseasesList() {
            try {
                const { data: res } = await axios.request({
                    method: 'GET',
                    url: '/api/report/getAllReports',
                });
                setReportUsers(res.data);
            } catch (error) {
                console.error(error);
            }
        }
        handleGetDiseasesList();
        setHasRun(true);
    }, [hasRun]);

    console.log(reportUsers)

    // Si lastReport tiene contenido, agregarlo a reportUsers
    useEffect(() => {
        if (lastReport) {
            setReportUsers((prevReportUsers) => {
                const updatedReportUsers = [...prevReportUsers, lastReport];
                // Actualizar los datos de la tabla después de agregar el reporte
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
    

    // Transformar los datos de reportUsers a la estructura que espera la tabla
    const transformData = (reportUsers: ReportUser[]): DataType[] => {
        return reportUsers.map(user => ({
            id: user.id,
            affiliate_name: user.affiliate_name,
            social_security_number: user.social_security_number,
            phone: user.phone,
        }));
    };

    // Cargar los datos cuando cambian los parámetros de la tabla
    useEffect(() => {
        if (reportUsers.length > 0) {
            const { pageSize = 10, current = 1 } = tableParams.pagination || {};
            const users = transformData(reportUsers.slice((current - 1) * pageSize, current * pageSize));
            setData(users);
        }
    }, [reportUsers, tableParams.pagination?.current, tableParams.pagination?.pageSize]);

    const handleTableChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
            sortField: Array.isArray(sorter) ? undefined : sorter.field,
        });

        // Limpiar los datos cuando cambie el tamaño de la página
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setData([]);
        }
    };

    // Maneja la visualización del reporte del usuario
    const handleViewReport = async (userId: number) => {
        try {
            const selectedReport = reportUsers.find(user => user.id === userId);
            if (selectedReport) {
                //setSelectedUser(selectedReport);
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
            title: 'ID',
            dataIndex: 'id',
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
                pagination={tableParams.pagination}
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
                        <p><strong>Nombre del Paciente:</strong> {selectedUser.affiliate_name}</p>
                        <p><strong>Edad:</strong> {selectedUser.age}</p>
                        <p><strong>Centro de Estudio:</strong> {selectedUser.study_center}</p>
                        <p><strong>Número de Seguridad Social:</strong> {selectedUser.social_security_number}</p>
                        <p><strong>Accidente de Tráfico:</strong> {selectedUser.traffic_accident ? 'Sí' : 'No'}</p>
                        <p><strong>Enfermedad:</strong> {selectedUser.disease.name}</p>
                        {/* Aquí puedes mostrar más información relacionada con el reporte */}
                    </div>
                ) : (
                    <p>Cargando...</p>
                )}
            </Modal>
        </>
    );
};

export default ListUsers;
