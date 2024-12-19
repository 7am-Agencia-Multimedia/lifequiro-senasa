'use client'

import ListUsers from '@/components/form/ListUsers'
import FormReport from '@/components/reportList/FormReport'
import SearchUser from '@/components/reportList/SearchUser'
import { Disease, ReportUser, userData } from '@/utils/types'
import { Button, Form} from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

type Props = {
    status: 0 | 1;
}
const ListReports = ({status}: Props) => {

    const [isLoading, setIsLoading] = useState(true);
    const [modalIdUser, setModalIdUser] = useState(false);
    const [modalForm, setModalForm] = useState(false);

    // OBETENER ID DE USUARIO Y DATA USER 
    
    const [idUser, setIdUser] = useState<number | undefined>(undefined);
    const [userData, setUserData] = useState<userData>();
    const [loading, setLoading] = useState(false);
    const [errorSearchUser, setErrorSearchUser] = useState(false);
    const [lastReport, setLastReport] = useState<ReportUser>();
    const [successReport, setSuccessReport] = useState(false);

    // USERS
    const showModalUser = () => {
        setIdUser(undefined);
        setModalIdUser(!modalIdUser);
    };

    // FORM
    const showModalForm = () => {
        setModalForm(!modalForm);
    };

    const clearModal = () => {
        setModalForm(false)
        setUserData(undefined)
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    //OBTENER ENFERMEDADES

    const [diseases, setDiseases] = useState<Disease[]>([]);
    const [hasRun, setHasRun] = useState(false);

    useEffect(() => {
        if (hasRun || !modalForm) return;
        async function handleGetDiseasesList() {
            try {
                const { data: res } = await axios.request({
                    method: 'GET',
                    url: '/api/disease/getAllDiseasesFrom',
                });
                setDiseases(res.data.data);
            } catch (error) {
                console.error(error);
            }
        }
        handleGetDiseasesList();
        setHasRun(true);
    }, [modalForm, hasRun]);

    //onsole.log(diseases) 

    

    const handleInputChange = (value: number) => {
        setIdUser(value);
    };

    const handleOk = async () => {
        setErrorSearchUser(false)
        setLoading(true);
        try {
            const { data: res } = await axios.request({
                method: 'POST',
                url: '/api/user/id',
                data: { paciente_id: idUser }
            });
            if (res.error) {
                setErrorSearchUser(true);
            } else if (res.data && res.code === 200) {
                setUserData(res.data);
                showModalUser();
                showModalForm();
            }
        } catch (error) {
            setErrorSearchUser(true);
            console.error(error);
            alert("Hubo un error al procesar la solicitud.");
        } finally {
            setLoading(false);
        }
    };

    return (
        isLoading ? (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
        ) : (
                <div className='flex flex-col justify-center gap-5'>
                    {status === 0 && 
                    <div className='flex flex-col justify-center items-center h-full w-full'>
                        <div className='w-full flex justify-end items-center'>
                            <Button type="primary" className='font-semibold w-fit' onClick={showModalUser}>+ Crear nuevo reporte</Button>
                        </div>
                    </div>}
                    <ListUsers 
                        lastReport={lastReport}
                        successReport={successReport}
                        statusFiltered={status}
                    />
                    <SearchUser
                        visible={modalIdUser}
                        showModal={showModalUser}
                        idUser={idUser}
                        //handleModalCancel={handleModalCancel}
                        handleOk={handleOk}
                        loading={loading}
                        handleInputChange={handleInputChange}
                        errorSearchUser={errorSearchUser}
                    />
                    {userData && (
                        <FormReport
                            modalForm={modalForm}
                            showModalForm={showModalForm}
                            userData={userData}
                            clearModal={clearModal}
                            diseases={diseases}
                            setLastReport={setLastReport}
                            setSuccessReport={setSuccessReport}
                            setDiseases={setDiseases}
                        />
                    )}
                </div>)
    )
}

export default ListReports