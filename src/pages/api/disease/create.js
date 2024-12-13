import axios from "axios";
import { serialize } from "cookie";

export default async function POST(req, res) {

    console.log(JSON.stringify(req.body))

    try {
        const { data: response } = await axios.request({
            url: `${process.env.SERVER_URL}/diseases`,
            method: 'POST',
            headers: {
                Authorization: `Bearer ${req.cookies['auth-token']}`
            },
            data: req.body,
        })
        res.status(200).json(response)
    } catch (error) {
        console.log(error.response)
        res.status(500).json(error?.response?.data ?? error)
    }
}