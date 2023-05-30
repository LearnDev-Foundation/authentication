import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connect from './database/conn.js';
import router from './routes/route.js';
import dotenv from 'dotenv';
import RateLimit from 'express-rate-limit';

dotenv.config();

const app = express();

// Rate limiter
const limiter = RateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100 // 100 requests
})

// Middlewares
app.use(express.json());
app.use(morgan('tiny'));
app.disable('x-powered-by');
app.use(cors({
    origin: 'https://ldfacademy.vercel.app',
    credentials: true
}));
app.use(limiter);
  

const port = 8080 || process.env.PORT;

// Routes
app.get('/', (req, res) => {
    res.status(201).json("Home GET Request");
});

app.use('/api', router);

// Connect to database

connect().then(() => {
    try {
        // Start server
        app.listen(port, () => {
            console.log(`Server running on port: ${port}`);
        })
    } catch (error) {
        console.log('Cannot connect to the server')
    }
}).catch((error) => {
    console.log(error);
});

// app.listen(port, () => {
//     console.log(`Server started on port: ${port}`);
// })