
const express = require('express');
const http = require('http');
const socketio = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

let usersockets = {};
let socketusers = {};
let rooms = [];


io.on('connection', function(socket) {
    console.log('Someone connected');
    console.log(socket.id);



    socket.on('login', function (data) {
        usersockets[data.username] = socket;
        socketusers[socket.id] = data.username;


        io.emit('logged_in_chat', {
            sender: socketusers[socket.id],
            chat: "Just Logged In"
        });

        socket.on('createRoom',function (data) {
            socket.join(data.room);
            rooms[socket.id]= data.room;
        });


    });

    socket.on('chat', function (data) {

        var msg = data.chat.trim();
        //console.log(msg);
        let privatechat = msg.substr(0,1);
        //console.log(privatechat);
        if(privatechat =='@')
        {
            msg = msg.substr(1);
            let ind = msg.indexOf(' ');
            if(ind!==-1) {

                let privateuser = msg.substr(0, ind);
                msg = msg.substr(ind + 1);

                if(privateuser in usersockets)
                {
                    usersockets[privateuser].emit('whisper',{chat : msg,sender:socketusers[socket.id]});

                    console.log('Private Message');
                }
            }
        }
        else{
        io.to(rooms[socket.id]).emit('chat', {
            sender: socketusers[socket.id],
            chat: data.chat
            
        })}
    });

    socket.on('disconnect', function (data) {
        io.emit('logged_out_chat', {
            sender: socketusers[socket.id],
            chat: "Logged Off"
        })
    })
});



app.use('/', express.static(__dirname + "/public_static"));


server.listen(3232, function () {
    console.log("Server started on http://localhost:3232");
});