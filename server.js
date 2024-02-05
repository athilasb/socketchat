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

app.use('/', (req, res) => {
    res.render('index.html');
});

io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.id}`);
    socket.on('sendMessage', data => {
        messages.push({
            id: socket.id,
            message: data.message, // Pega a mensagem da propriedade 'message' do objeto data
            autor: data.autor // Pega o autor da propriedade 'autor' do objeto data
        });

        io.emit('receivedMessage', { id: socket.id, ...data }); // Inclui o ID do socket no objeto data
    })
})

server.listen(3002);
