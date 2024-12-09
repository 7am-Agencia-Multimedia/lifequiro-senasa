import Image from "next/image";

export default function ReportPrintTemplate({ page }: { page: number }) {
    return (
        <div className={'flex flex-col h-screen overflow-auto'}>
            <Page1 />
            <Page2 />
        </div>
    );
}

function Page1() {
    return (
        <div className={'flex flex-col gap-8 bg-white aspect-[1/1.414] h-full p-10 text-[.65rem] font-medium select-none'}>
            <div className={'flex items-center justify-center gap-8'}>
                <Image src={'/senasa.png'} alt={'senasa'} width={45} height={50} />
                <div className={'flex flex-col divide-y'}>
                    <div className={'flex items-center border-black'}>
                        <span className={'font-bold w-14'}>Titulo</span>
                        <span>Formato de historia clínica para la preautorización de procedimientos</span>
                    </div>
                    <div className={'flex items-center border-black'}>
                        <span className={'font-bold w-14'}>Código</span>
                        <span>GSS-FORM-078</span>
                    </div>
                    <div className={'flex items-center border-black'}>
                        <span className={'font-bold w-14'}>Versión</span>
                        <div className={' grid grid-cols-2 divide-x'}>
                            <span>00</span>
                            <span className={'pl-1 border-black'}>Fecha de aprobación: 02/12/2021</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={'flex flex-col border border-black'}>
                <div className={'flex items-end justify-end p-1 pb-5 border-b border-black'}>
                    <span className={'font-bold leading-3'}>Fecha de solicitud:</span>
                    <div className={'w-40 border-b border-black'}></div>
                </div>
                <div className={'flex flex-col border-black divide-y'}>
                    <div className={'flex justify-between border-black'}>
                        <div className={''}>
                            <div className={'font-semibold bg-black text-white p-1 w-[7.8rem]'}>Nombre del médico:</div>
                        </div>
                        <div className={'flex'}>
                            <div className={'font-semibold bg-black text-white p-1 w-24'}>Código:</div>
                            <div className={'w-24'}></div>
                        </div>
                    </div>
                    <div className={'flex justify-between border-black'}>
                        <div className={''}>
                            <div className={'font-semibold bg-black text-white p-1 w-[7.8rem]'}>Nombre del afiliado:</div>
                        </div>
                        <div className={'flex'}>
                            <div className={'font-semibold bg-black text-white p-1 w-24'}>NSS:</div>
                            <div className={'w-24'}></div>
                        </div>
                    </div>
                    <div className={'flex justify-between border-black'}>
                        <div className={''}>
                            <div className={'font-semibold bg-black text-white p-1 w-[7.8rem]'}>Cédula:</div>
                        </div>
                        <div className={'flex'}>
                            <div className={'font-semibold bg-black text-white p-1 w-24'}>Edad:</div>
                            <div className={'w-24'}></div>
                        </div>
                    </div>
                    <div className={'flex justify-between border-black'}>
                        <div className={''}>
                            <div className={'font-semibold bg-black text-white p-1 w-[7.8rem]'}>Sexo:</div>
                        </div>
                        <div className={'flex'}>
                            <div className={'font-semibold bg-black text-white p-1 w-24'}>Teléfono:</div>
                            <div className={'w-24'}></div>
                        </div>
                    </div>
                    <div className={'flex border-black'}>
                        <div className={''}>
                            <div className={'font-semibold bg-black text-white p-1 pr-7'}>Centro donde se realizará el estudio:</div>
                        </div>
                    </div>
                    <div className={'flex border-black'}>
                        <div className={''}>
                            <div className={'font-semibold bg-black text-white p-1 pr-7'}>Centro donde se realiza el procedimiento:</div>
                        </div>
                    </div>
                    <div className={'flex border-black'}>
                        <div className={''}>
                            <div className={'font-semibold bg-black text-white p-1 pr-7'}>Accidente de tránsito:</div>
                        </div>
                        <div className={'flex divide-x border-r border-black'}>
                            <span className={'grid place-content-center font-bold w-10 border-black'}>Sí</span>
                            <span className={'grid place-content-center font-bold w-10 border-black'}></span>
                            <span className={'grid place-content-center font-bold w-10 border-black'}>No</span>
                            <span className={'grid place-content-center font-bold w-10 border-black'}></span>
                        </div>
                    </div>
                </div>
                <div className={'flex flex-col'}>
                    <div className={'font-semibold bg-black text-white p-1 text-center'}>Diagnóstico (s):</div>
                    <div className={'p-1'}>
                        Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto.
                        Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500,
                        cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó
                        una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen.
                    </div>
                </div>
                <div className={'flex flex-col'}>
                    <div className={'font-semibold bg-black text-white p-1 text-center'}>Nombre del (los) procedimiento (s):</div>
                    <div className={'p-1'}>
                        1. Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. <br/>
                        2. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500,<br />
                        3. cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó<br />
                        4. una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen.<br />
                    </div>
                </div>
                <div className={'flex flex-col'}>
                    <div className={'font-semibold bg-black text-white p-1 text-center'}>Historia de la enfermedad actual:</div>
                    <div className={'p-1'}>
                        Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto.
                        Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500,
                        cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó
                        una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen.
                    </div>
                </div>
            </div>
        </div>
    )
}

function Page2() {
    return (
        <div className={'flex flex-col gap-8 bg-white aspect-[1/1.414] h-full p-10 text-[.65rem] font-medium select-none'}>
            <div className={'flex items-center justify-center gap-8'}>
                <Image src={'/senasa.png'} alt={'senasa'} width={45} height={50} />
                <div className={'flex flex-col divide-y'}>
                    <div className={'flex items-center border-black'}>
                        <span className={'font-bold w-14'}>Titulo</span>
                        <span>Formato de historia clínica para la preautorización de procedimientos</span>
                    </div>
                    <div className={'flex items-center border-black'}>
                        <span className={'font-bold w-14'}>Código</span>
                        <span>GSS-FORM-078</span>
                    </div>
                    <div className={'flex items-center border-black'}>
                        <span className={'font-bold w-14'}>Versión</span>
                        <div className={' grid grid-cols-2 divide-x'}>
                            <span>00</span>
                            <span className={'pl-1 border-black'}>Fecha de aprobación: 02/12/2021</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={'flex flex-col border border-black'}>
                <div className={'flex flex-col'}>
                    <div className={'font-semibold bg-black text-white p-1 text-center'}>Antecedente patológico:</div>
                    <div className={'p-1'}>
                        Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto.
                        Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500,
                        cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó
                        una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen.
                    </div>
                </div>
            </div>
        </div>
    )
}