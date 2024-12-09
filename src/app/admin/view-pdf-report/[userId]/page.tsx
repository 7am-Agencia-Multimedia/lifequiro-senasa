'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ReportUser } from '@/utils/types';
import jsPDF from 'jspdf';
import ReportPrintTemplate from '@/components/reportList/ReportPrintTemplate';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const ViewPdfReport = ({ params }: { params: { userId: string } }) => {
    const { userId } = params;
    const [loading, setLoading] = useState(false);
    const [reportUser, setReportUser] = useState<ReportUser | null>(null);

    useEffect(() => {
        setLoading(true);
        async function fetchReportUser() {
            try {
                const response = await axios.get(`/api/report/reportById`, {
                    params: { userId },
                });
                setReportUser(response.data);
            } catch (error) {
                console.error('Error al obtener el reporte:', error);
            } finally {
                setLoading(false);
            }
        }
        if (userId) {
            fetchReportUser();
        }
    }, [userId]);

    const downloadPDF = () => {
        
    };

    const [ page, setPage ] = useState(1);

    return (
        loading ? (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
        ) : (
            <div className="relative w-full h-screen overflow-hidden flex flex-col justify-center items-center bg-gray-200">
                {/* Contenedor de la imagen */}
                <div className={'relative h-full'}>
                    <button 
                        className={'absolute top-1/2 -translate-y-1/2 -left-11 disabled:text-neutral-400 text-2xl'} 
                        disabled={page === 1}
                        onClick={() => setPage(1)}
                    > 
                        <LeftOutlined  />
                    </button>
                    <ReportPrintTemplate page={page} />
                    <button 
                        className={'absolute top-1/2 -translate-y-1/2 -right-11 disabled:text-neutral-400 text-2xl'} 
                        disabled={page === 2}
                        onClick={() => setPage(2)}
                    >
                        <RightOutlined  />
                    </button>
                </div>

                {/* Botón para descargar PDF */}
                <div className="absolute bottom-5 flex gap-4">
                    <button
                        onClick={downloadPDF}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Descargar como PDF
                    </button>
                </div>
            </div>
        )
    );
};

export default ViewPdfReport;
