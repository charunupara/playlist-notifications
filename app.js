const auth = require('./src/routes/auth');
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const port = 8888;

app.use('/auth', auth);
app.use(cookieParser());
  
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});