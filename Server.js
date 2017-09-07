/**
 * Created by nguyenhoangthong on 05/09/2017.
 */
var app = require('http').createServer();
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(3000);
io.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    //create new user
    socket.on('newUser', function(data) {
        socket.username = data;
        console.log(socket.username);

    });

    //create room and join room
    socket.on('create', function(data) {
       console.log(data);
       socket.join(data.room_id);
       socket.in(data.room_id).emit('join room', {user: socket.username, room: data.room_id});
    });

    //listen event message send from client
    socket.on('send',function(data){
        console.log(data);
        //emit event transfer message to all user in this room
        socket.in(data.room).emit('message',{user: data.username, message: data.message});
    });

    //listen event leave room from user
    socket.on('leave', function(data) {
        socket.leave(data.room);
        socket.in(data.room).emit('user left', {user: data.user, room: data.room});
    });


});