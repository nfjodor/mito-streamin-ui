const { app, BrowserWindow } = require('electron');
const express = require('express');
const path = require('path');

let mainWindow = null;

const socketServer = express().listen(18499, () => {
    console.log('socketServer running on port 18499');
});

const appServer = express()
    .use(express.static(`${__dirname}/app`))
    .listen(18501, () => {
        console.log('socketServer running on port 18501');
    });

const io = require('socket.io')(socketServer);
const streamerSettings = {
    cameras: {},
    sceneClass: '',
    title: '',
    subTitle: ''
};

io.on('connection', (socket) => {
    socket.emit('SET_CAMERAS', streamerSettings.cameras);
    socket.emit('SET_SCENE', streamerSettings.sceneClass);
    socket.emit('SET_TITLE', streamerSettings.title);
    socket.emit('SET_SUB_TITLE', streamerSettings.subTitle);

    socket.on('SET_CAMERA', (data) => {
        streamerSettings.cameras[`${data.type}`] = data.id;
        socket.broadcast.emit('SET_CAMERAS', streamerSettings.cameras);
    });
    socket.on('SET_SCENE', (data) => {
        streamerSettings.sceneClass = data;
        socket.broadcast.emit('SET_SCENE', streamerSettings.sceneClass);
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

function initialize() {
    makeSingleInstance()

    function createWindow() {
        const windowOptions = {
            width: 800,
            minWidth: 380,
            height: 460,
            inHeight: 460,
            title: app.getName()
        }

        mainWindow = new BrowserWindow(windowOptions);
        mainWindow.loadURL(`file://${__dirname}/app/index.html#/admin`);

        mainWindow.on('closed', () => {
            mainWindow = null
        })
    }

    app.on('ready', () => {
        createWindow();
    })

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    })

    app.on('activate', () => {
        if (mainWindow === null) {
            createWindow();
        }
    })
}

function makeSingleInstance() {
    if (process.mas) return;

    app.requestSingleInstanceLock();

    app.on('second-instance', () => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) {
                mainWindow.restore();
            }
            mainWindow.focus();
        }
    });
}

initialize();