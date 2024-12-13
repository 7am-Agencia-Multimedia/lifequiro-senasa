import axios from 'axios';

export default async function handler(req, res) {
    try {
        const { id } = req.query;
        
        //console.log('peticion:', id);
        //console.log('asdasda', req.query);

        if (!id) {
            return res.status(400).json({ error: "ID is required" });
        }

        const { data: response } = await axios.request({
            url: `${process.env.SERVER_URL}/diseases/${id}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${req.cookies['auth-token']}`
            }
        });

        res.status(200).json(response);
    } catch (error) {
        console.error(error.response ? error.response.data : error);
        res.status(500).json(error?.response?.data ?? { message: "Internal server error" });
    }
}
