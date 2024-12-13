import axios from "axios";
import { serialize } from "cookie";

export default async function PUT(req, res) {

    const {id, disease, variants} = req.body;

    console.log({id, disease, variants})

    try {
        const { data: response } = await axios.request({
            url: `${process.env.SERVER_URL}/diseases/${id}`,
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${req.cookies['auth-token']}`
            },
            data: {
                disease,
                variants,
            },
        })
        res.status(200).json(response)
    } catch (error) {
        console.log(error.response)
        res.status(500).json(error?.response?.data ?? error)
    }
}