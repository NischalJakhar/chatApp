

const socket = io();


// socket.emit('createRoom','room1');

console.log('We are connected to server');
setTimeout(function () {

    console.log(socket.id);
}, 1000);

let chatbox = null;

window.onload = function () {

    document.getElementById('joinRoom').onclick = function () {
        let room = document.getElementById('room').value;
        document.getElementById("iAmRoom").innerText = "You are in "+room+ " room";

        socket.emit('createRoom',{room:room});
    };

    document.getElementById('send').onclick = function () {
        let chat = document.getElementById('chat').value;

        document.getElementById('chat').value=null;




        socket.emit('chat', {chat: chat})

    };

    document.getElementById('login').onclick = function () {
        let username = document.getElementById('username').value;


        socket.emit('login', {username: username})
    };

    chatbox = document.getElementById('chatbox');
    logging = document.getElementById('logging');
};

socket.on('chat', function (data) {
    chatbox.innerHTML +=
        "<li>" + data.sender + " : " + data.chat + "</li>"
});

socket.on('logged_out_chat', function (data) {
    logging.innerHTML +=
        "<li>" + data.sender + " : " + data.chat + "</li>"
});


socket.on('logged_in_chat', function (data) {
    loggingin.innerHTML +=
        "<li>" + data.sender + " : " + data.chat + "</li>"
});



socket.on('whisper', function (data) {
    chatbox.innerHTML +=
        "<span class='private'>" + "<li>" + data.sender + " : " + data.chat + "</li>" + "</span>"
});

 function on() {
     document.getElementById("overlay").style.display = "block";
 }

 function off() {
     document.getElementById("overlay").style.display = "none";
 }


