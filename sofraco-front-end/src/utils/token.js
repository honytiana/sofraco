const axios = require('axios');
const config = require('../config.json');

exports.getUserToken = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    try{
        const result = await axios.get(`${config.nodeUrl}/api/token/user/${user}`, {
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