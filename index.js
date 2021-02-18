var express=require('express');
var socket=require('socket.io');
const { v4: uuidv4 } = require('uuid');
var app =express();
var server = app.listen(3000, function () {
    console.log('listening on port 3000!');
});
app.set('view engine', 'ejs');
app.use(express.static('public'));
var conn=socket(server);
conn.on('connection', function (socket) {
    console.log('Established connection', socket.id);
    socket.on('chat', function (data) {
        conn.sockets.emit('chat', data);
    });
    socket.on('typing', function (username) {
        socket.broadcast.emit('typing', username);
    });
    socket.on('join-room', (rId, uId) => {
        console.log(rId, uId);
        socket.join(rId);
        socket.to(rId).broadcast.emit('initiate-newCall', uId);
        socket.on('disconnect', ()=> {
            socket.to(rId).broadcast.emit('call-cut', uId);
        });
    });
});
app.get('/video', (req, res)=> {
    res.redirect(`/${uuidv4()}`);
});
app.get('/:room', (req, res)=> {
    res.render('room', { rId: req.params.room });
});