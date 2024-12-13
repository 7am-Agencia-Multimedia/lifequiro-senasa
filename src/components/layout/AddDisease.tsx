import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Spin, Alert } from 'antd'
import ListDiseases from '../form/ListDiseases'
import FormAddDisease from '../disease/FormAddDisease'
import FromEditDisease from '../disease/FromEditDisease'
import { Disease, PaginationTypes } from '@/utils/types'

const AddDisease = () => {
    const [diseases, setDiseases] = useState<Disease[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalForm, setModalForm] = useState(false);
    const [editModalForm, setEDitModalForm] = useState(false);
    const [idDiseaseSelected, setIdDiseaseSelected] = useState<number | undefined>(undefined);
    const [diseaseSelected, setDiseaseSelected] = useState<Disease | undefined>(undefined);
    const [loadingGetId, setLoadingGetId] = useState(false);
    const [errorSearchUser, setErrorSearchUser] = useState(false);

    const [currentPage, setCurrenPage] = useState(1);
    const [pagination, setPagination] = useState<PaginationTypes>({
        totalPages: 1,
        total: 0,
        limit: 10,
    })

    // COMPRUEBA SI SE REALIZO PETICION PARA ACTUALIZAR LA LISTA
    const [deleteUser, setDeleteUser] = useState(false);
    const [addDisease, setAddDisease] = useState(false);
    const [editDisease, setEditDisease] = useState(false);

    const showModalForm = () => {
        setModalForm(!modalForm);
    };

    const showEditModalForm = () => {
        setEDitModalForm(true);
    };

    const showCloseEditModalForm = () => {
        setEDitModalForm(false);
        setIdDiseaseSelected(undefined);
        setDiseaseSelected(undefined);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    async function handleGetDiseasesList() {
        if (!currentPage) return;

        try {
            const { data: res } = await axios.request({
                method: 'POST',
                url: '/api/disease/getAll',
                data: {
                    page: currentPage || 1,
                }
            });
            setDiseases(res.data.data);
            setPagination({
                totalPages: res.data.totalPages,
                total: res.data.total,
                limit: res.data.limit,
            })
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        handleGetDiseasesList();
    }, [deleteUser, addDisease, editDisease, currentPage]);


    const changePage = (page: number) => {
        if (page > pagination.totalPages) return;
        if (page < 1) return;
        console.log(page)
        setCurrenPage(page)
    }

    useEffect(() => {
        if (idDiseaseSelected !== undefined) {
            const fetchDisease = async () => {
                setLoadingGetId(false);
                setErrorSearchUser(false);
                try {
                    const { data: res } = await axios.request({
                        method: 'GET',
                        url: `/api/disease/byId/${idDiseaseSelected}`,
                    });
                    setDiseaseSelected(res.data);
                    setLoadingGetId(true);
                } catch (error) {
                    console.error(error);
                    setLoadingGetId(false);
                    setErrorSearchUser(true);
                }
            };
            fetchDisease();
        }
    }, [idDiseaseSelected]);

    // Aquí controlamos si el diseaseSelected es válido antes de abrir el modal
    useEffect(() => {
        if (diseaseSelected) {
            showEditModalForm();
        }
    }, [diseaseSelected]);

    return (
        isLoading ? (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
        ) : (
            <div className='flex flex-col justify-center gap-5'>
                <div className='flex flex-col justify-center items-center h-full w-full'>
                    <div className='w-full flex justify-end items-center'>
                        <Button onClick={showModalForm} type="primary" className='font-semibold w-fit'>+ Agregar nueva enfermedad</Button>
                    </div>
                </div>
                <ListDiseases
                    diseases={diseases}
                    setDiseaseSelected={setIdDiseaseSelected}
                    showEditModalForm={showEditModalForm}
                    setDeleteUser={setDeleteUser}
                    changePage={changePage}
                    pagination={pagination}
                />
                <FormAddDisease
                    modalForm={modalForm}
                    showModalForm={showModalForm}
                    setAddDisease={setAddDisease}
                />
                {editModalForm && (
                    <div className="relative">
                        {!loadingGetId ? (
                            <div className="fixed inset-0 flex justify-center items-center z-10">
                                <Spin size="large" />
                            </div>
                        ) : errorSearchUser ? (
                            <Alert
                                message="Error al cargar los datos de la enfermedad"
                                type="error"
                                showIcon
                                closable
                                className="absolute top-0 left-0 w-full z-10"
                            />
                        ) : (
                            <FromEditDisease
                                modalForm={editModalForm}
                                showModalForm={showEditModalForm}
                                showCloseEditModalForm={showCloseEditModalForm}
                                loadingGetId={loadingGetId}
                                diseaseSelected={diseaseSelected}
                                errorSearchUser={errorSearchUser}
                                setEditDisease={setEditDisease}
                            />
                        )}
                    </div>
                )}
            </div>
        )
    );
};

export default AddDisease;
