
'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ReportUser } from '@/utils/types';

const ViewPdfReport = ({ params }: { params: { userId: string } }) => {

    const { userId } = params;
    const [loading, setLoading] = useState(false);
    const [reportUser, setReportUser] = useState<ReportUser | null>(null);

    useEffect(() => {
        setLoading(true)
        async function fetchReportUser() {
            try {
                const response = await axios.get(`/api/report/reportById`, {
                    params: { userId },
                });
                setReportUser(response.data);
            } catch (error) {
                console.error('Error al obtener el reporte:', error);
            } finally {
                setLoading(false)
            }
        }
        if (userId) {
            fetchReportUser();
        }
    }, [userId]);

    console.table(reportUser)

    return (
        loading ? (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
        ) : (
            <div
                className="relative w-full h-screen overflow-hidden flex justify-center items-center bg-gray-200"
                style={{
                    backgroundImage: "url('/pdf1.jpg')", // Cambia la ruta a la imagen correcta
                    backgroundSize: "contain", // Escala la imagen para que se ajuste sin distorsionarse
                    backgroundPosition: "center", // Centra la imagen
                    backgroundRepeat: "no-repeat", // Evita que se repita
                }}
            >
            </div>
        )

    );
};

export default ViewPdfReport;
