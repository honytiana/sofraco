const axios = require('axios');
require('dotenv').config();

exports.getUserToken = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    try{
        const result = await axios.get(`${process.env.REACT_APP_NODE_URL_EXTERNE}/api/token/user/${user}`, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const token = result.data.value;
        return token;
    } catch(err) {
        console.log(err);
    }
}