const axios = require('axios');
require('dotenv').config();
const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, SIGNING_KEY } = process.env;

module.exports = {
    async requestAccessToken(params) {
        const { data } = await axios.post('https://accounts.spotify.com/api/token', params.toString(), {
            headers: {
                'Authorization': 'Basic ' + (new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')),
                'content-type': 'application/x-www-form-urlencoded'
            }
        });

        return data;
    }
}