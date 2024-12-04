import axios from "axios";
import { serialize } from "cookie";

export default async function POST(req, res) {
    const { email, password } = req.body;
    try {
        const { data: response } = await axios.request({
            url: `${process.env.SERVER_URL}/auth/login`,
            method: 'POST',
            data: {
                email,
                password
            }
        })
        const date = new Date();
        date.setMonth(date.getMonth() + 2)
        res.setHeader('Set-Cookie', serialize('auth-token', response?.data?.token, {
            path: "/",
            expires: date,
        }));
        res.status(200).json(response)
    } catch (error) {
        console.log(error.response)
        res.status(500).json(error?.response?.data ?? error)
    }
}