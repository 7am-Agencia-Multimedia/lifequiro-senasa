import React, { useEffect, useState } from 'react';
import { Button, Table, Modal } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import { Disease, PaginationTypes } from '@/utils/types';
import axios from 'axios';
import { ExclamationCircleFilled } from '@ant-design/icons';


const { confirm } = Modal;

const formatDate = (date: string): string => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
};

type Props = {
    diseases: Disease[] | undefined;
    setDiseaseSelected: React.Dispatch<number>;
    showEditModalForm: () => void;
    setDeleteUser: React.Dispatch<boolean>;
    changePage: (page:number) => void;
    pagination: PaginationTypes;

}

const onChange: TableProps<Disease>['onChange'] = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
};

const ListDiseases: React.FC<Props> = ({ diseases, setDiseaseSelected, showEditModalForm, setDeleteUser, changePage, pagination }) => {

    const handleViewReport = (id: number) => {
        setDiseaseSelected(id);
        showEditModalForm()
        console.log(id)
    };

    const showDeleteConfirm = (id: number, name: string) => {
        confirm({
            title: `¿Deseas eliminar la enfermedad ${name}? `,
            icon: <ExclamationCircleFilled />,
            okText: 'Si',
            okType: 'danger',
            cancelText: 'No',
            onCancel() {
                console.log('Cancel');
            },
            onOk() {
                handleDeleteDisease(id)
            },
        });
    };

    const handleDeleteDisease = async (id: number) => {
        setDeleteUser(true)
        try {
            const { data: res } = await axios.request({
                method: 'PUT',
                url: '/api/disease/delete',
                data: {
                    id,
                },
            });
        } catch (error) {
            console.error(error);
            setDeleteUser(false)
        } finally {
            setDeleteUser(false)
        }
    }

    const columns: TableColumnsType<Disease> = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: '1%',
        },
        {
            title: 'Creado',
            width: '2%',
            render: (text, record: Disease) => {
                // Formateamos la fecha usando la función personalizada
                const formattedDate = formatDate(record.created_at);
                return formattedDate; // Devuelve la fecha formateada
            },
        },
        {
            title: 'Enfermedad',
            dataIndex: 'name',
            width: '7%',
        },
        {
            title: 'Variantes',
            render: (text, record: Disease) => {
                const variants = record.variants || [];
                const maxVariants = 5;
                const displayedVariants = variants.length > maxVariants ? variants.slice(0, maxVariants) : variants;
                const variantText = displayedVariants
                    .map((variant, index) => (index < displayedVariants.length - 1 ? variant.name + ', ' : variant.name))
                    .join('');
                const finalText = variants.length > maxVariants ? variantText + '...' : variantText;
                return (
                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                        {finalText}
                    </div>
                );
            },
            width: '25%',
        },
        {
            title: '',
            dataIndex: '',
            width: '5%',
        },
        {
            title: '',
            key: 'action',
            width: '1%',
            render: (text, record) => (
                <Button onClick={() => handleViewReport(record.id)}><i className="fa-duotone fa-solid fa-pen text-neutral-500"></i></Button>
            ),
        },
        {
            title: '',
            key: 'action',
            width: '1%',
            render: (text, record) => (
                <Button danger onClick={() => showDeleteConfirm(record.id, record.name)}><i className="fa-duotone fa-solid fa-trash"></i></Button>
            ),
        },
    ];

    return (
        <Table
            rowKey="id"
            dataSource={diseases}
            columns={columns}
            pagination={{
                pageSize: pagination.limit,
                total: pagination.total,
                onChange: (e) => changePage(e)
            }}
        />
    )
};

export default ListDiseases;
