const express = require('express');
const app = express();
const port = 5001;

app.use(express.json());
const authRoutes = require('./routes/auth.route');
const touristRoutes = require('./routes/tourist.route');

//Health check route
app.get('/', (req, res) => {
    res.json({
        status: "OK",
        message: "Welcome to the Trailshield API"
    });
});
app.use('/auth', authRoutes);
app.use('/tourist', touristRoutes);

//Server listening
app.listen(port, () => {
    console.log(`Trailshield API Gateway running at PORT: ${port}`);
});