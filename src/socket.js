const express = require('express');

const socketServer = express().listen(18499, () => {
    console.log('socketServer running on port 18499');
});

const io = require('socket.io')(socketServer);
const streamerSettings = {
    cameras: {},
    scene: {
        scene: '',
        className: '',
    },
    title: '',
    subTitle: ''
};

io.on('connection', (socket) => {
    socket.emit('SET_CAMERAS', streamerSettings.cameras);
    socket.emit('SET_SCENE', streamerSettings.scene);
    socket.emit('SET_TITLE', streamerSettings.title);
    socket.emit('SET_SUB_TITLE', streamerSettings.subTitle);

    socket.on('SET_CAMERA', (data) => {
        streamerSettings.cameras[`${data.type}`] = data.id;
        socket.broadcast.emit('SET_CAMERAS', streamerSettings.cameras);
    });
    socket.on('SET_SCENE', (data) => {
        streamerSettings.scene = data;
        socket.broadcast.emit('SET_SCENE', streamerSettings.scene);
    });
    socket.on('SET_TITLE', (data) => {
        streamerSettings.title = data;
        socket.broadcast.emit('SET_TITLE', streamerSettings.title);
    });
    socket.on('SET_SUB_TITLE', (data) => {
        streamerSettings.subTitle = data;
        socket.broadcast.emit('SET_SUB_TITLE', streamerSettings.subTitle);
    });
});