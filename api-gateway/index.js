const express = require('express');
const app = express();
const port = 5001;

app.use(express.json());
const authRoutes = require('./routes/auth.route');

//Health check route
app.get('/', (req, res) => {
    res.json({
        status: "OK",
        message: "Welcome to the Trailshield API Gateway!"
    });
});
app.use('/api/auth', authRoutes);

//Server listening
app.listen(port, () => {
    console.log(`Trailshield API Gateway running at PORT: ${port}`);
});