import axios from "axios";

export default async function DELETE(req, res) {

    const { id } = req.body;

    console.log(id);

    try {
        const { data: response } = await axios.request({
            url: `${process.env.SERVER_URL}/diseases/${id}`,
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${req.cookies['auth-token']}`
            }
        })
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json(error?.response?.data ?? error)
    }
}