import axios from "axios";
import { serialize } from "cookie";

export default async function POST(req, res) {

    const {id, status} = req.body;
    console.log(req.body)

    try {
        const { data: response } = await axios.request({
            url: `${process.env.SERVER_URL}/reports/${id}`,
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${req.cookies['auth-token']}`
            },
            data: { status }
        })
        res.status(200).json(response)
    } catch (error) {
        console.log(error.response)
        res.status(500).json(error?.response?.data ?? error)
    }
}