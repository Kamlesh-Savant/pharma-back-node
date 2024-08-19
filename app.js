// app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./User/userRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/api/v1', userRoutes);

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
