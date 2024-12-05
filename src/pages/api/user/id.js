import axios from 'axios';
import https from 'https';

const agent = new https.Agent({
    rejectUnauthorized: false
});

export default async function handler(req, res) {
    const { paciente_id } = req.body;

    if (!paciente_id) {
        return res.status(400).json({ error: "paciente_id is required" });
    }

    try {
        const { data: reportUser } = await axios.request({
            method: 'GET',
            url: `https://quiropractico.com.do/quirocita/api/v2/patientinfo/?paciente_id=${paciente_id}`,
            headers: {
                'Authorization': `Bearer ZVFNanF0anV5dy9ULytTN3c4V1FRZz09`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            httpsAgent: agent
        });

        return res.status(200).json(reportUser);
    } catch (error) {
        // console.error('Error de solicitud:', error);
        // console.error('Response data:', error?.response?.data);
        res.status(500).json(error?.response?.data ?? error);
    }
}
