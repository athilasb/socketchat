const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const messages = []; // Inicialize a variável messages

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', (req, res) => {
    res.render('index.html');
});

io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.id}`);
    socket.on('sendMessage', data => {
        messages.push({
            id: socket.id,
            message: data.message,
            autor: data.autor
        });

        io.emit('receivedMessage', { id: socket.id, ...data });
    });
});

const port = process.env.PORT || 3002;
server.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
