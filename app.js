const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./User/userRoutes');
const categoryRoutes = require('./Category/categoryRoutes'); // Corrected import
const divisionRoutes = require('./Division/divisionRoutes'); // Corrected import
const productRoutes = require('./Product/productRoutes');
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/v1', userRoutes); // Namespace routes under /users
app.use('/api/v1', categoryRoutes); // Namespace routes under /categories
app.use('/api/v1', divisionRoutes); // Namespace routes under /categories
app.use('/api/v1', productRoutes); // Namespace routes under /categories


app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
