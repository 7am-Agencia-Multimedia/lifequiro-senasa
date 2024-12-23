import axios from "axios";

export default async function GET(req, res) {

    const {page} = req.body;

    console.log(page);

    try {
        const { data: response } = await axios.request({
            url: `${process.env.SERVER_URL}/diseases?page=${page}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${req.cookies['auth-token']}`
            }
        })
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json(error?.response?.data ?? error)
    }
}