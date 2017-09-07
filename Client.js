/**
 * Created by nguyenhoangthong on 05/09/2017.
 */
Client = {
    username: null,
    room: null,

    setUserName: function() {
        //Client.join_room();
        var username = document.getElementById("username").value;
        console.log(username);
        socket.username = username;
        Client.username = username;
        socket.emit("newUser",username);
    },

    joinRoom: function() {
        var room_id = document.getElementById("roomid").value;
        Client.room = room_id;
        console.log(room_id);
        console.log("client room id", room_id.toString());
        socket.emit('create', {
            room_id: Client.room,
            username: Client.username
        });
    },

    chatroom: function() {
        if(socket.username){
            console.log(socket.id);
            var text = document.getElementById("message").value;
            console.log(Client.username+" :"+text);
            var ownmsg = text;
            Client.createText(ownmsg, socket.username);
            //emit event send message
            socket.emit('send',{room: Client.room, message: text, username: Client.username});
            document.getElementById("message").value = "";
        }

    },

    createText: function(message,user) {
        if(user == socket.username){
            var para = document.createElement("div");
            para.setAttribute("class","text-r");
            var node = document.createTextNode(message);
            para.appendChild(node);
            var element = document.getElementById("chat_room");
            element.appendChild(para);
        } else{
            var para = document.createElement("p");
            para.setAttribute("class","text-l");
            var node = document.createTextNode(message);
            para.appendChild(node);
            var element = document.getElementById("chat_room");
            element.appendChild(para);
        }

    },

    receive: function() {
        socket.on('message', function(data) {
            //console.log(data.user+" said:"+ data.message);
            var msg =  data.message;
            //var msg = data.user.toUpperCase()+" :"+ data.message;
            Client.createText(msg, data.user);
        });

        socket.on('user left', function(data){
           var msg = data.user+ " left room "+data.room;
            Client.createText(msg, data.user);
        });

        socket.on('join room', function(data) {
           console.log(data);
           var msg = data.user+ " joined room "+data.room;
            Client.createText(msg, data.user);
        });

    },

    leaveRoom: function () {
        socket.emit('leave', {user: Client.username, room: Client.room});
        document.getElementById("roomid").value = "";
        Client.room = null;
        var msg = document.getElementsByClassName("text-l");
        var msg1 = document.getElementsByClassName("text-r");
        while(msg[0]){
            msg[0].parentNode.removeChild(msg[0]);
        }
        while(msg1[0]){
            msg1[0].parentNode.removeChild(msg1[0]);
        }
    }
}