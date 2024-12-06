'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ReportUser } from '@/utils/types';
import jsPDF from 'jspdf';

const ViewPdfReport = ({ params }: { params: { userId: string } }) => {
    const { userId } = params;
    const [loading, setLoading] = useState(false);
    const [reportUser, setReportUser] = useState<ReportUser | null>(null);

    const images = ['/pdf1.jpg', '/pdf2.jpg']; // Rutas de tus imágenes
    const [currentImage, setCurrentImage] = useState(0); // Estado para el slider

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
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [794, 1123], // Tamaño de la imagen en píxeles
        });

        // Cargar la primera imagen
        const img1 = new Image();
        img1.src = '/pdf1.jpg'; // Ruta de tu primera imagen
        img1.onload = () => {
            doc.addImage(img1, 'JPEG', 0, 0, 794, 1123);

            // Cargar la segunda imagen
            const img2 = new Image();
            img2.src = '/pdf2.jpg'; // Ruta de tu segunda imagen
            img2.onload = () => {
                // Agregar una nueva página para la segunda imagen
                doc.addPage();
                doc.addImage(img2, 'JPEG', 0, 0, 794, 1123);

                // Descargar el PDF con ambas imágenes
                doc.save('reporte.pdf');
            };
        };
    };

    // Función para cambiar entre las imágenes y actualizar el estado de la imagen activa
    const handleImageChange = (index: number) => {
        setCurrentImage(index);
    };

    return (
        loading ? (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
        ) : (
            <div className="relative w-full h-screen overflow-hidden flex flex-col justify-center items-center bg-gray-200">
                {/* Contenedor de la imagen */}
                <div
                    className="relative"
                    style={{
                        width: '794px', // Ancho de la imagen en píxeles
                        height: '1123px', // Alto de la imagen en píxeles
                        backgroundImage: `url(${images[currentImage]})`, // Usamos el estado para cambiar la imagen
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                >
                    {/* Texto posicionado sobre la imagen */}
                    <div className="absolute top-10 left-10 text-white bg-black bg-opacity-50 p-4 rounded">
                        Este es un texto que aparece sobre la imagen.
                    </div>

                    {/* Botones de navegación del slider */}
                    <button
                        onClick={() => handleImageChange(currentImage === 0 ? 1 : 0)} // Cambia entre imagen 1 y 2
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                        {currentImage === 0 ? 'Ver Imagen 2' : 'Ver Imagen 1'}
                    </button>
                </div>

                {/* Botón para descargar PDF */}
                <div className="absolute bottom-10 flex gap-4">
                    <button
                        onClick={downloadPDF}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Descargar como PDF
                    </button>
                </div>
            </div>
        )
    );
};

export default ViewPdfReport;
