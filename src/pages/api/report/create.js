import axios from "axios";
import { serialize } from "cookie";

export default async function POST(req, res) {

    // if (!code || !affiliate_id || !affiliate_name || !social_security_number || !age || !phone || !study_center || !procedure_center || !traffic_accident || !center_id || !disease_id || !disease_variant_id || !procedure_names || !current_disease_history) {
    //     return res.status(400).json({ message: "Missing data in request body" });
    // }

    try {
        const { data: response } = await axios.request({
            url: `${process.env.SERVER_URL}/reports`,
            method: 'POST',
            data: req.body,
            headers: {
                Authorization: `Bearer ${req.cookies['auth-token']}`
            }
        })
        res.status(200).json(response)
    } catch (error) {
        console.log(error.response)
        res.status(500).json(error?.response?.data ?? error)
    }
}