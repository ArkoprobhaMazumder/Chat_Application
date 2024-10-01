// Third party Apis
import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';

// Builtin Apis
import http from 'http';
import chatModel from './chatSchema.schema.js';



// configure express app
const app = express();

// configuring cross origin 
app.use(cors());


// create and export our server
export const server = http.createServer(app);


// Configure new server from socket instances 
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});

let totalUser = 0;

// configre requests events
io.on('connection', (socket) => {
    console.log('socket connect');

    socket.on('newJoin', (name) => {
        socket.userName = name;
        totalUser += 1;
        socket.totalUser = totalUser;

        socket.emit('incrementUser', socket.totalUser);

        socket.broadcast.emit('newMember', { userName: socket.userName, totalUser: socket.totalUser });
    });

    socket.on('typing', (userName) => {
        socket.broadcast.emit('incomingChat', userName)
    })

    socket.on('newMessage', async (message) => {
        let chat = new chatModel({
            userName: socket.userName,
            message: message,
            timeStamp: new Date()
        })
        let data = await chat.save();
        console.log(data);
        socket.broadcast.emit('message', data);
    })


    socket.on('disconnect', (userName) => {
        socket.totalUser = 0;
        console.log('socket disconnect');

        // socket.emit('userLeft', { userName: userName, totalUser: socket.totalUser - 1 });
    })
})


