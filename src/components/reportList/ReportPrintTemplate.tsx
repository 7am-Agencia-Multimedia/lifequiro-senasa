import { ReportUser } from "@/utils/types";
import Image from "next/image";

type Props = {
    report: ReportUser | null,
    //user: userData | null,
}
export default function ReportPrintTemplate({ report }: Props) {

    const today = new Date();

    // Formatear la fecha en "dd/mm/yyyy"
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear();

    const fechaFormateada = `${day}/${month}/${year}`;

    //const prueba = "Plan a seguir 1 ||Plan a seguir 3|Plan a seguir 4|Plan a seguir 5"

    const procedure = report?.procedure_names?.split('|') ?? [];
    const treatment = procedure.filter(plan => plan.trim() !== "");

    while (treatment.length < 5) {
        treatment.push("");
    }

    console.log(report)

    return (
        <div className={'flex flex-col w-full'}>
            <div id="printOne" className={'flex flex-col gap-8 bg-white aspect-[1/1.414] h-full p-10 text-[.65rem] font-medium select-none'}>
                <div className={'flex items-center justify-center gap-8'}>
                    <Image src={'/senasa.png'} alt={'senasa'} width={45} height={50} priority />
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
                        <div className={'w-40 border-b border-black px-1'}>{fechaFormateada}</div>
                    </div>
                    <div className={'flex flex-col border-black divide-y'}>
                        <div className={'flex justify-between border-black'}>
                            <div className={'flex justify-center items-center'}>
                                <div className={'font-semibold bg-black text-white p-1 w-[7.8rem]'}>Nombre del médico:</div>
                                <p className="px-1">{report?.doctor_name}</p>
                            </div>
                            <div className={'flex justify-center items-center'}>
                                <div className={'font-semibold bg-black text-white p-1 w-24'}>Código:</div>
                                <div className={'px-1 w-24'}>{report?.code}</div>
                            </div>
                        </div>
                        <div className={'flex justify-between border-black'}>
                            <div className={'flex justify-center items-center'}>
                                <div className={'font-semibold bg-black text-white p-1 w-[7.8rem]'}>Nombre del afiliado:</div>
                                <p className="px-1">{report?.affiliate_name}</p>
                            </div>
                            <div className={'flex ustify-center items-center'}>
                                <div className={'font-semibold bg-black text-white p-1 w-24'}>NSS:</div>
                                <div className={'w-24 px-1'}>{report?.social_security_number}</div>
                            </div>
                        </div>
                        <div className={'flex justify-between border-black'}>
                            <div className={'flex justify-center items-center'}>
                                <div className={'font-semibold bg-black text-white p-1 w-[7.8rem]'}>Cédula:</div>
                                <p className="px-1">{report?.affiliate.document_no}</p>
                            </div>
                            <div className={'flex ustify-center items-center'}>
                                <div className={'font-semibold bg-black text-white p-1 w-24'}>Edad:</div>
                                <div className={'w-24 px-1'}>{report?.affiliate.age}</div>
                            </div>
                        </div>
                        <div className={'flex justify-between border-black'}>
                            <div className={'flex ustify-center items-center'}>
                                <div className={'font-semibold bg-black text-white p-1 w-[7.8rem]'}>Sexo:</div>
                                <p className="px-1">{report?.affiliate.gender === 'F' ? 'Femenino' : 'Masculino'}</p>
                            </div>
                            <div className={'flex justify-center items-center'}>
                                <div className={'font-semibold bg-black text-white p-1 w-24'}>Teléfono:</div>
                                <div className={'w-24 px-1'}>{report?.phone}</div>
                            </div>
                        </div>
                        <div className={'flex border-black'}>
                            <div className={'flex justify-center items-center'}>
                                <div className={'font-semibold bg-black text-white p-1 pr-7'}>Centro donde se realizará el estudio:</div>
                                <p className="px-1">{report?.study_center}</p>
                            </div>
                        </div>
                        <div className={'flex border-black'}>
                            <div className={'flex justify-center items-center'}>
                                <div className={'font-semibold bg-black text-white p-1 pr-7'}>Centro donde se realiza el procedimiento:</div>
                                <p className="px-1">{report?.procedure_center}</p>
                            </div>
                        </div>
                        <div className={'flex border-black'}>
                            <div className={''}>
                                <div className={'font-semibold bg-black text-white p-1 pr-7'}>Accidente de tránsito:</div>
                            </div>
                            <div className={'flex divide-x border-r border-black'}>
                                <span className={'grid place-content-center font-bold w-10 border-black'}>Sí</span>
                                <span className={'grid place-content-center font-bold w-10 border-black'}>{report?.traffic_accident ? 'X' : ''}</span>
                                <span className={'grid place-content-center font-bold w-10 border-black'}>No</span>
                                <span className={'grid place-content-center font-bold w-10 border-black'}>{!report?.traffic_accident ? 'X' : ''}</span>
                            </div>
                        </div>
                    </div>
                    <div className={'flex flex-col'}>
                        <div className={'font-semibold bg-black text-white p-1 text-center'}>Diagnóstico (s):</div>
                        <div className={'p-1 h-[85px]'}>
                                {report && (
                                    report?.diseases.length > 1 ? (
                                        report.diseases.map((disease, index) => (
                                            <div key={index} className={'flex flex-col'}>
                                                <p>{disease.name}, {disease.variant.name}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>{report?.diseases[0].name}, {report?.diseases[0].variant.name}</p>
                                    )
                                )}
                        </div>
                    </div>
                    <div className={'flex flex-col'}>
                        <div className={'font-semibold bg-black text-white p-1 text-center'}>Nombre del (los) procedimiento (s):</div>
                        <div className={'flex flex-col p-1 h-28'}>
                            {treatment?.map((plan, index) => (
                                <div key={index}>
                                    {index + 1}: {plan}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={'flex flex-col'}>
                        <div className={'font-semibold bg-black text-white p-1 text-center'}>Historia de la enfermedad actual:</div>
                        <div className={'p-1 max-w-xl h-72 overflow-y-auto'}>
                            <p className="whitespace-normal break-words">
                                {report?.current_disease_history}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            {/* PAGE 2 */}
            <div id="printSecond" className={'flex flex-col gap-8 bg-white aspect-[1/1.414] h-full p-10 text-[.65rem] font-medium select-none'}>
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
                <div className="flex flex-col">
                    <div className={'flex flex-col border border-black'}>
                        <div className={'font-semibold bg-black text-white p-1 mt-5'}>Antecedente patológico:</div>
                        <div className={'p-1 max-w-xl h-96 overflow-y-auto'}>
                            <p className="whitespace-normal break-words">
                                {report?.pathological_antecedent}
                            </p>
                        </div>
                    </div>
                    <div className={'flex justify-center items-end border-b border-x border-black h-16'}>
                        <p className="font-bold py-1">Firma y sello del médico</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
