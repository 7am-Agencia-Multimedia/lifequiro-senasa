'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ReportUser, userData } from '@/utils/types';
import jsPDF from 'jspdf';
import ReportPrintTemplate from '@/components/reportList/ReportPrintTemplate';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const ViewPdfReport = ({ params }: { params: { userId: string } }) => {
    const { userId } = params;
    const [loading, setLoading] = useState(false);
    const [reportUser, setReportUser] = useState<ReportUser | null>(null);
    const [userData, setUserData] = useState<userData | null>(null);
    const [errorSearchUser, setErrorSearchUser] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetching the report data
                const reportResponse = await axios.get(`/api/report/reportById`, {
                    params: { userId },
                });
                if (reportResponse.data.data) {
                    setReportUser(reportResponse.data.data);
                } else {
                    console.error('Error al obtener el reporte');
                }

                // Fetching user data
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

    console.log(userData) 

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
        );
    }

    if (errorSearchUser || !reportUser || !userData) {
        return (
            <div className="flex justify-center items-center h-screen text-red-500">
                <p>Hubo un error al obtener los datos. Por favor, intente nuevamente.</p>
            </div>
        );
    }

    return (
        <div className="relative w-full h-auto overflow-hidden flex flex-col justify-center items-center bg-gray-200">
            <ReportPrintTemplate report={reportUser} user={userData}/>
        </div>
    );
};

export default ViewPdfReport;
