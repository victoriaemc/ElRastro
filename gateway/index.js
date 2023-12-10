const express = require('express');
const cors = require('cors');
const proxy = require('express-http-proxy');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"],
        credentials: true,
        transports: ['websocket']
    },
});


mongoose.connect("mongodb+srv://xmariafdz:d6sNRoSlX55dLrCQ@ingweb.zuuicah.mongodb.net/elrastro", {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once("open", () => console.log("Connected to the database!"));

app.use(cors());
app.use(express.json());

// Middleware para manejar Socket.io
app.use((req, res, next) => {
    req.io = io; // Agrega el objeto io a la solicitud para que esté disponible en las rutas
    next();
});

// Rutas de proxy a microservicios
app.use('/bids', proxy('http://bid:8001'));
app.use('/users', proxy('http://user:8003'));
app.use('/', proxy('http://product:8002'));

// Rutas de prueba para Socket.io
app.get('/socket-test', (req, res) => {
    const io = req.io;
    io.emit('message', 'Hello from the gateway!');
    res.status(200).json({ message: 'Message sent!' });
});

io.on("connect", (socket) => {
    console.log(`Usuario conectado: ${socket.id}`);

    // Aquí puedes manejar eventos específicos de conexión, si es necesario
});

io.on("disconnect", (socket) => {
    console.log(`Usuario desconectado: ${socket.id}`);

    // Aquí puedes manejar eventos específicos de desconexión, si es necesario
});

app.listen(8000, () => {
    console.log("Gateway listening to port 8000");
});

app.use('/', (req, res) => {
    return res.status(200).json({"msg": "Welcome to El Rastro API. Please use /api-docs to see the documentation"});
});
