const express = require('express');
const router = express.Router();

const { buildAuthURL, getToken } = require('../services/auth');


router.get('/login', (req, res) => {
    const spotifyURL = buildAuthURL();
    res.redirect(spotifyURL);
});

router.get('/callback', async (req, res) => {
    const code = req.query.code;
    const state = req.query.state;

    try {
        await getToken(code);
        res.send('done');
    } catch (error) {
        console.log(error);
    }
})

router.get('/refresh-token', async (req, res) => {
    const refreshToken = req.params.refresh_token;

    try {
        res.send('done');
    } catch (error) {
        console.log(error);
    }
});


module.exports = router;