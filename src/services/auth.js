const url = require('url');
require('dotenv').config();
const { requestAccessToken } = require('../client/spotify');
const { generateRandomString } = require('../lib/generateRandomString');
const { CLIENT_ID, REDIRECT_URI, CLIENT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const axios = require('axios');
const aws = require('aws-sdk');

const TABLE_NAME = 'PlaylistNotificationsStack-AccessTokenTable9844FC16-1K2LO743RGT1A';

const docClient = new aws.DynamoDB.DocumentClient({ region: 'us-east-2'});


module.exports = {
    buildAuthURL () {
        const state = generateRandomString(16);
        const scope = 'user-read-private user-read-email';
        const spotifyURL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=${scope}&state=${state}`;
        return spotifyURL;
    },
    async getToken (code) {
        try {
            // step 1: get access and refresh tokens from Spotify
            const params = new url.URLSearchParams({
                code: code,
                redirect_uri: REDIRECT_URI,
                grant_type: 'authorization_code'
            });

            const { access_token: accessToken } = await requestAccessToken(params);

            // step 2: get userID

            const { data: { id: userID } } = await axios.get('https://api.spotify.com/v1/me', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'content-type': 'application/x-www-form-urlencoded'
                }
            });

            

            const dynamoParams = {
                TableName: TABLE_NAME,
                Item: {
                    userID,
                    accessToken
                }
            };

            // step 3: put accessToken (and TTL) and refresh token in dynamo (keyed by userID)
            try {
                await docClient.put(dynamoParams).promise()
            } catch (err) {
                console.log('ruh roh can\'t put to dynamo', err);
            }
            

            // step 4: return the token
            return tokens;
        } catch (error) {
            console.log(error.data);
        }

    },
    async buildRefreshedAuthToken (refreshToken) {
        try {
            const params = new url.URLSearchParams({
                grant_type: 'refresh_token', 
                refresh_token: refreshToken
            });

            const accessToken = await requestAccessToken(params);

            const signedToken = jwt.sign(accessToken, SIGNING_KEY, { expiresIn: '3600s'});

            return signedToken;

        } catch (error) {
            console.log(error);
        }
    }
};
