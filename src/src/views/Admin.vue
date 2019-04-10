<template>
  <div class="admin">
    <div class="title">
      <h2>Presenter camera</h2>
      <h2>Presentation camera</h2>
    </div>
    <div class="cameras">
      <div class="presenter">
        <div>
          <input type="radio" id="presenter_null" value="" v-model="presenterCamera">
          <label for="presenter_null">none</label>
        </div>
        <div v-for="camera in cameraList" :key="camera.id">
          <input type="radio" :disabled="camera.id === presentationCamera" :id="`presenter_${camera.deviceId}`" :value="camera.id" v-model="presenterCamera">
          <label :for="`presenter_${camera.deviceId}`">{{ camera.name }}</label>
        </div>
      </div>
      <div class="presentation">
        <div>
          <input type="radio" id="presentation_null" value="" v-model="presentationCamera">
          <label for="presentation_null">none</label>
        </div>
        <div v-for="camera in cameraList" :key="camera.id">
          <input type="radio" :disabled="camera.id === presenterCamera" :id="`presentation_${camera.deviceId}`" :value="camera.id" v-model="presentationCamera">
          <label :for="`presentation_${camera.deviceId}`">{{ camera.name }}</label>
        </div>
      </div>
    </div>
    <div class="title">
      <h2>Scene</h2>
    </div>
    <div class="radio-list">
      <input type="radio" id="presenter" value="presenter" v-model="currentScene">
      <label for="presenter">Presenter</label>
      <input type="radio" id="presentation" value="presentation" v-model="currentScene">
      <label for="presentation">Presentation</label>
      <input type="radio" id="both" value="" v-model="currentScene">
      <label for="both">Both</label>
    </div>
    <div class="title">
      <h2>Headline</h2>
      <h2>Small headline</h2>
    </div>
    <div class="text-settings">
      <input type="text" v-model="title">
      <input type="text" v-model="subTitle">
    </div>
    <span class="client">client address: <a href="http://localhost:18499" target="_top">http://localhost:18499</a></span>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import WebCam from '@/components/webcam.vue';

export default {
  name: 'admin',
  data() {
    return {
      presenterCamera: '',
      presentationCamera: '',
      title: '',
      subTitle: '',
      currentScene: '',
    };
  },
  computed: {
    ...mapGetters({
      cameraList: 'app/getCameras',
      selectedCameraList: 'app/getSelectedCameras',
      getConnection: 'app/getConnection',
      remoteTitle: 'app/getTitle',
      remoteSubTitle: 'app/getSubTitle',
      remoteScene: 'app/getScene',
    }),
    presenterCameraList() {
      return this.cameraList.filter(camera => camera.id !== this.presentationCamera);
    },
    presentationCameraList() {
      return this.cameraList.filter(camera => camera.id !== this.presenterCamera);
    }
	},
  components: {
    WebCam,
  },
  watch: {
    remoteTitle(title) {
      this.title = title;
    },
    remoteSubTitle(title) {
      this.subTitle = title;
    },
    presenterCamera(id) {
      this.$store.dispatch('app/setCamera', {type: 'presenterCamera', id} )
    },
    presentationCamera(id) {
      this.$store.dispatch('app/setCamera', {type: 'presentationCamera', id} )
    },
    selectedCameraList(list) {
      Object.keys(list).forEach((camType) => {
        this[`${camType}`] = list[camType];
      });
    },
    currentScene(newScene, oldScene) {
      let sceneClass = '';
      if (newScene === 'presenter' || newScene === 'presentation') {
        if (oldScene === 'presenter' || oldScene === 'presentation') {
          sceneClass += `from-${oldScene}-`;
        }
        sceneClass += `to-${newScene}`;
      } else if (oldScene) {
        sceneClass = `to-both-from-${oldScene}`;
      }
      this.$store.dispatch('app/setScene', { scene: newScene, className: sceneClass });
    },
    title(newTitle) {
      this.$store.dispatch('app/setTitle', newTitle);
    },
    subTitle(newTitle) {
      this.$store.dispatch('app/setSubTitle', newTitle);
    },
    remoteScene(scene) {
      this.currentScene = scene;
    }
  },
  methods: {
    keydownListener(event) {
      if ([112, 113, 114].includes(event.keyCode)) {
        event.preventDefault();
        let scene = '';
        switch (event.keyCode) {
          case 112:
            scene = 'presenter';
            break;
          case 113:
            scene = 'presentation';
            break;
          default:
            break;
        }
        this.currentScene = scene;
      }
    }
  },
  mounted() {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const cameraList = devices.filter(device => device.kind === 'videoinput');
      this.$store.dispatch('app/fillCameras', cameraList);
    });
    window.removeEventListener('keydown', this.keydownListener);
    window.addEventListener('keydown', this.keydownListener);
  },
  destroyed() {
    window.removeEventListener('keydown', this.keydownListener);
  }
}
</script>
<style scoped lang="scss">
.title {
  display: flex;
  justify-content: space-between;

  h2 {
    font-family: 'Zilla Slab', serif;
    width: 100%;
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    color: #b3e1ff;
    margin: 0 0 10px;
	  text-shadow: #000 0 4px 5px;
  }
}

.client {
  color: #b3e1ff;
  display: block;
  text-align: center;
  font-size: 13px;
  margin-top: 20px;
  font-family: 'Zilla Slab', serif;
}
.admin {
  padding: 15px;
  font-family: 'Nunito', serif;
}
.webcam {
  display: none;
}
.radio-list {
  display: flex;
  justify-content: stretch;
  background-color: #000;
  border-radius: 7px;
  padding: 2px;
  margin-bottom: 20px;
}

.cameras {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;

  & > div {
    flex: 0 0 calc(50% - 5px);
    width: calc(50% - 5px);
    background-color: #000;
    border-radius: 7px;
    padding: 2px 3px;
  }

  input[type="radio"] + label {
    border-radius: 0 !important;
    margin: 1px 0;
  }

  div div:first-of-type input[type="radio"] + label {
    border-radius: 4px 4px 0 0 !important;
  }

  div div:last-of-type input[type="radio"] + label {
    border-radius: 0 0 4px 4px !important;
  }
}

input[type="radio"] {
  display: none;

  & + label {
    width: 100%;
    text-align: center;
    cursor: pointer;
    border: 0px;
    display: block;
    background-image: linear-gradient(to top, #242424 0%, #303030 100%);
    box-shadow: inset 0 20px 4px -21px rgba(255,255,255,0.4), 0 10px 13px 0 rgba(0,0,0,0.3);
    color: rgba(0,0,0,0.8);
    text-shadow: 0 1px 2px rgba(255,255,255,0.1);
    font-family: 'Zilla Slab', serif;
    font-weight: 900;
    font-size: 14px;
    padding: 8px 15px;
    margin: 1px;
    position: relative;
    user-select: none;
    overflow: hidden;
    -webkit-appearance: none;
    transition: all .3s ease;

    &:first-of-type {
      border-radius: 4px 0 0 4px;
    }
    &:last-of-type {
      border-radius: 0 4px 4px 0;
    }

    &::after {
      content: '';
      position: absolute;
      display: block;
      width: 80%;
      height: 60%;
      background-image: radial-gradient(circle 30px at center, #ebf7ff 0%, #b3e1ff 47%, #b3e1ff 100%);
      filter: blur(10px);
      top: 50%;
      left: 50%;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      opacity: 0;
      mix-blend-mode: overlay;
      transition: all .3s ease;
    }
  }

  &:checked + label {
    color: rgba(#b3e1ff, .75);
    background-image: linear-gradient(to top, #151515 0%, #1d1d1d 100%);
    box-shadow: inset 0 16px 14px -21px transparent, 0 0px 13px 0 rgba(0,0,0,0.3), inset 0 0 7px 2px rgba(0,0,0,0.4);

    &::after {
      opacity: 1;
    }
  }

  &:disabled + label {
    background-image: linear-gradient(to top, #151515 0%, #1d1d1d 100%);
    box-shadow: inset 0 16px 14px -21px transparent, 0 0px 13px 0 rgba(0,0,0,0.3), inset 0 0 7px 2px rgba(0,0,0,0.4);
    cursor: not-allowed;
  }
}

.text-settings {
  display: flex;
  justify-content: space-between;

  input {
    flex: 0 0 calc(50% - 10px);
    width: calc(50% - 10px);
    font-family: 'Nunito', serif;
    background: transparent;
    padding: 5px 10px;
    font-weight: 700;
    font-size: 13px;
    color: rgba(#b3e1ff, .75);
    border: none;
    outline: none;
    border-bottom: 2px solid #000;
    transition: all .3s ease;

    &:focus {
      border-color: #b3e1ff;
    }
  }
}

a {
  color:#b3e1ff;
}

</style>

