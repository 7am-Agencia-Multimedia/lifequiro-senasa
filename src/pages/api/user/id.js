import axios from "axios";

export default async function handler(req, res) {
    const { paciente_id } = req.body;

    if (!paciente_id) {
        return res.status(400).json({ error: "paciente_id is required" });
    }

    try {
        // Hacer la solicitud a la API externa
        const { data: reportUser } = await axios.request({
            method: 'GET',
            url: `https://quiropractico.com.do/quirocita/api/v2/patientinfo/?paciente_id=${paciente_id}`,
            headers: {
                'Authorization': `Bearer ZVFNanF0anV5dy9ULytTN3c4V1FRZz09`,
                'Content-Type': 'application/json',
            },
        });

        // Retornar la respuesta de la API externa
        return res.status(200).json(reportUser);
    } catch (error) {
        // Manejar los errores
        return res.status(500).json(error?.response?.data ?? { error: "Internal server error" });
    }
}
