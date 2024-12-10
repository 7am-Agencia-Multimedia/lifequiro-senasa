'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ReportUser, userData } from '@/utils/types';
import ReportPrintTemplate from '@/components/reportList/ReportPrintTemplate';
import { Button } from 'antd';
import toast from 'react-hot-toast';

const ViewPdfReport = ({ params }: { params: { userId: string } }) => {
    const { userId } = params;
    const [loading, setLoading] = useState(false);
    const [reportUser, setReportUser] = useState<ReportUser | null>(null);
    const [userData, setUserData] = useState<userData | null>(null);
    const [errorSearchUser, setErrorSearchUser] = useState(false);
    const [printed, setPrinted] = useState(false);  // Estado para controlar si el usuario imprimió

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const reportResponse = await axios.get(`/api/report/reportById`, {
                    params: { userId },
                });
                if (reportResponse.data.data) {
                    setReportUser(reportResponse.data.data);
                } else {
                    console.error('Error al obtener el reporte');
                }

                const userResponse = await axios.post('/api/user/id', {
                    paciente_id: userId,
                });
                if (userResponse.data) {
                    setUserData(userResponse.data.data);
                } else {
                    setErrorSearchUser(true);
                }
            } catch (error) {
                console.error('Error al realizar las solicitudes:', error);
                setErrorSearchUser(true);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchData();
        }
    }, [userId]);

    // Imprimir solo una vez cuando los datos estén cargados
    useEffect(() => {
        if (reportUser && userData && !printed) {
            // Solo imprimir una vez cuando los datos estén listos
            window.print();
            setPrinted(true); // Marcar como impreso
        }
    }, [reportUser, userData, printed]);

    // async function handleChangeStatus() {
    //     //setLoading(true)
    //     try {
    //         const { data: res } = await axios.request({
    //             url: '/api/report/status',
    //             method: 'PATCH',
    //             data: {
    //                 id: userData?.id,
    //                 status: 1
    //             }
    //         });
    //         console.log(res.data) 
    //         // if (res.success === true) {
    //         //     window.close();
    //         // }
    //         toast.success('Reporte impreso')
    //     } catch (error) {
    //         toast.error('El reporte ya fue impreso')
    //     } finally {
    //         setLoading(false)
    //     }
    // }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className='flex w-full justify-center items-center'>
            <div className="relative w-[700px] h-auto overflow-hidden flex flex-col justify-center items-center bg-gray-200">
                {/* <Button onClick={handleChangeStatus} color="danger" variant="solid" htmlType="button" size='large' className='absolute top-24 buttonIgnore'>
                    Impreso
                </Button> */}
                <ReportPrintTemplate report={reportUser} user={userData} />
            </div>
        </div>
    );
};

export default ViewPdfReport;
