import Vue from 'vue';

const baseState = {
    cameras: [],
    presenterCamera: '',
    presentationCamera: '',
    connected: false,
    sceneClass: '',
    scene: '',
    title: '',
    subTitle: '',
};

// actions
const actions = {
    async socket_setCameras({ commit }, cameras) {
        commit('saveCameras', cameras);
        commit('setConnection', true);
    },
    async socket_setScene({ commit }, scene) {
        commit('setScene', scene);
    },
    async socket_setTitle({ commit }, title) {
        commit('setTitle', title);
    },
    async socket_setSubTitle({ commit }, title) {
        commit('setSubTitle', title);
    },
    async fillCameras({ commit }, cameraList) {
        commit('saveCameraList', cameraList);
    },
    async setCamera({ commit }, camera = {type: null, id: null}) {
        this._vm.$socket.emit('SET_CAMERA', camera);
    },
    async setScene({ commit }, scene = {}) {
        this._vm.$socket.emit('SET_SCENE', scene);
    },
    async setTitle({ commit }, title = '') {
        this._vm.$socket.emit('SET_TITLE', title);
    },
    async setSubTitle({ commit }, title = '') {
        this._vm.$socket.emit('SET_SUB_TITLE', title);
    },
};

// mutations
const mutations = {
    saveCameraList(state, cameraList = []) {
        state.cameras.length = 0;
        cameraList.forEach(camera => {
            state.cameras.push({
                id: camera.label,
                name: camera.label,
                deviceId: camera.deviceId
            });
        });
    },
    saveCameras(state, cameras) {
        Object.keys(cameras).forEach((camType) => {
            state[`${camType}`] = cameras[camType];
        });
    },
    setConnection(state, connected) {
        state.connected = connected;
    },
    setScene(state, scene) {
        state.sceneClass = scene.className;
        state.scene = scene.scene;
    },
    setTitle(state, title) {
        state.title = title;
        
    },
    setSubTitle(state, title) {
        state.subTitle = title;
    }
};

// getters
const getters = {
    getTitle: state => state.title,
    getSubTitle: state => state.subTitle,
    getSceneClass: state => state.sceneClass,
    getScene: state => state.scene,
    getConnection: state => state.connected,
    getCameras: state => state.cameras,
    getSelectedCameras: state => {
        return {
            presenterCamera: state.presenterCamera,
            presentationCamera: state.presentationCamera,
        }
    }
};

export default {
    namespaced: true,
    state: baseState,
    actions,
    mutations,
    getters,
};
