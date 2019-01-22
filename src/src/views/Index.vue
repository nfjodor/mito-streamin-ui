<template>
  <div class="index" :class="sceneClass">
    <svg-icon name="logo" :class="{'active': sceneClass.indexOf('to-presentation') === -1}"></svg-icon>
    <h2 :class="{'active': sceneClass.indexOf('to-both') !== -1 || !sceneClass}">{{ title }} <span v-if="subTitle">{{ subTitle }}</span></h2>
    <div class="box presenter">
        <svg-icon name="logo"></svg-icon>
        <web-cam ref="webcam"
          :device-id="presenterCam"/>
    </div>
    <div class="box box--16-9 presentation">
        <svg-icon name="logo"></svg-icon>
        <web-cam ref="webcam"
          :device-id="presentationCam"/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import SvgIcon from '@/components/SvgIcon.vue';
import WebCam from '@/components/webcam.vue';

export default {
  name: 'index',
  data() {
    return {
      presenterCam: '',
      presentationCam: ''
    }
  },
  components: {
    SvgIcon,
    WebCam,
  },
  computed: {
    ...mapGetters({
      cameraList: 'app/getCameras',
      selectedCameraList: 'app/getSelectedCameras',
      sceneClass: 'app/getSceneClass',
      title: 'app/getTitle',
      subTitle: 'app/getSubTitle',
    }),
  },
  watch: {
    selectedCameraList(camList) {
      const presenter = this.cameraList.filter((camera) => {
        return this.selectedCameraList.presenterCamera === camera.id;
      })[0];
      const presentation = this.cameraList.filter((camera) => {
        return this.selectedCameraList.presentationCamera === camera.id;
      })[0];
      this.presenterCam = presenter && presenter.deviceId || '';
      this.presentationCam = presentation && presentation.deviceId || '';
    }
  },
  mounted() {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const cameraList = devices.filter(device => device.kind === 'videoinput');
      this.$store.dispatch('app/fillCameras', cameraList);
    });
  }
};
</script>

<style scoped lang="scss">
  $timing: 1s;

  h2 {
    color: #fff;
    font-size: 110px;
    position: absolute;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    top: -45px;
    left: 55px;
    opacity: 0;
    transition: all $timing ease-in-out;

    &.active {
      opacity: 1;
      transition-delay: $timing / 2;
    }

    span {
      display: inline-block;
      border-left: 3px solid rgba(255, 255, 255, .2);
      font-family: 'Nunito', serif;
      font-size: 42px;
      margin-left: 50px;
      padding: 8px 0 8px 45px;
      font-weight: 400;
    }
  }

  .index {
    font-family: 'Zilla Slab', serif;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    min-width: 100vw;
    min-height: 100vh;
    background: linear-gradient(140deg, #ce135a 0%,#331a37 100%);
    perspective: 100px;
    overflow: hidden;

    &.to-presenter {
      .presenter {
        width: 100%;
        margin-left: -50%;
        transform: translate(0, 0) scale(1) rotateY(0deg);
        animation: presenter-go-fullscreen $timing ease-in-out;
      }
      .presentation {
        transform: translate(160%, 0) scale(1.5) rotateY(-3deg);
        animation: presentation-leave $timing ease-in-out;
      }
    }
    &.to-presentation {
      .presenter {
        transform: translate(-200%, 0) scale(1) rotateY(3deg);
        animation: presenter-leave $timing ease-in-out;
      }
      .presentation {
        transform: translate(0, 0) scale(1) rotateY(0deg);
        animation: presentation-go-fullscreen $timing ease-in-out;
      }
    }
    &.to-both-from-presenter,
    &.to-both-from-presentation {
      .presenter {
        width: 56.25%;
        margin-left: -28.125%;
        transform: translate(-34%, 0) scale(.55) rotateY(0.5deg);
      }
      .presentation {
        transform: translate(15%, 0) scale(.57) rotateY(-0.5deg);
      }
    }
    &.to-both-from-presenter {
      .presenter {
        animation: presenter-go-back $timing ease-in-out;
      }
      .presentation {
        animation: presentation-enter $timing ease-in-out;
      }
    }
    &.to-both-from-presentation {
      .presenter {
        animation: presenter-enter $timing ease-in-out;
      }
      .presentation {
        animation: presentation-go-back $timing ease-in-out;
      }
    }
    &.from-presentation-to-presenter {
      .presenter {
        width: 100%;
        margin-left: -50%;
        transform: translate(0, 0) scale(1);
        transform-origin: 50%;
        z-index: 10;
        animation: to-forward-left $timing * 1.5 ease-in-out;
      }
      .presentation {
        transform: translate(0, 0) scale(.4);
        animation: to-backward-right $timing * 1.5 ease-in-out;
      }
    }
    &.from-presenter-to-presentation {
      .presenter {
        width: 100%;
        margin-left: -50%;
        transform-origin: 50%;
        transform: translate(0, 0) scale(.4);
        animation: to-backward-left $timing * 1.5 ease-in-out;
      }
      .presentation {
        z-index: 10;
        transform: translate(0, 0) scale(1);
        animation: to-forward-right $timing * 1.5 ease-in-out;
      }
    }
  }

  .svg--logo {
    position: absolute;
    bottom: 5%;
    left: 2.5%;
    width: 14.15%;
    height: 6.85%;
    opacity: 0;
    z-index: 100;
    transition: all $timing / 1.5 ease-in-out;

    &.active {
      opacity: 1;
      transition-delay: $timing;
    }
  }

  .box {
    position: relative;
    width: 56.25%;
    padding-top: 56.25%;
    margin-top: -28.125%;
    margin-left: -28.125%;
    overflow: hidden;
    background: linear-gradient(140deg, #ce135a 0%,#331a37 100%);
    box-shadow: 0 10px 200px rgba(0, 0, 0, .3);
    z-index: 1;

    &--16-9 {
      width: 100%;
      margin-left: -50%;
    }

    video {
      min-width: 100%; 
      min-height: 100%; 
      width: auto;
      height: auto;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      z-index: 10;
    }

    .svg--logo {
      width: 80%;
      height: 80%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      opacity: 1;
      z-index: 1;
    }
  }

  .presenter {
    position: absolute;
    top: 50%;
    left: 50%;
    transform-origin: 0 50%;
    width: 56.25%;
    margin-left: -28.125%;
    transform: translate(-34%, 0) scale(.55) rotateY(0.5deg);
  }

  .presentation {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(15%, 0) scale(.57) rotateY(-0.5deg);
  }

  @keyframes presenter-enter {
    0%, 100% {
      width: 56.25%;
      margin-left: -28.125%;
    }
    0% { transform: translate(-200%, 0) scale(1) rotateY(3deg); }
    100% { transform: translate(-34%, 0) scale(.55) rotateY(0.5deg); }
  }

  @keyframes presenter-leave {
    0%, 100% {
      width: 56.25%;
      margin-left: -28.125%;
    }
    0% { transform: translate(-34%, 0) scale(.55) rotateY(0.5deg); }
    100% { transform: translate(-200%, 0) scale(1) rotateY(3deg); }
  }

  @keyframes presenter-go-back {
    0%, 10% { transform: translate(0, 0) scale(1) rotateY(0deg); }
    0% {
      width: 100%;
      margin-left: -50%;
    }
    100% {
      width: 56.25%;
      margin-left: -28.125%;
      transform: translate(-34%, 0) scale(.55) rotateY(0.5deg);
    }
  }

  @keyframes presenter-go-fullscreen {
    0% {
      width: 56.25%;
      margin-left: -28.125%;
      transform: translate(-34%, 0) scale(.55) rotateY(0.5deg);
    }
    100% {
      width: 100%;
      margin-left: -50%;
      transform: translate(0, 0) scale(1) rotateY(0deg);
    }
  }

  @keyframes presentation-enter {
    0%, 10% { transform: translate(160%, 0) scale(1.5) rotateY(-3deg); }
    100% {  transform: translate(15%, 0) scale(.57) rotateY(-0.5deg); }
  }

  @keyframes presentation-leave {
    0% { transform: translate(15%, 0) scale(.57) rotateY(-0.5deg); }
    100% {  transform: translate(160%, 0) scale(1.5) rotateY(-3deg); }
  }

  @keyframes presentation-go-back {
    0% { transform: translate(0, 0) scale(1) rotateY(0deg); }
    100% { transform: translate(15%, 0) scale(.57) rotateY(-0.5deg); }
  }

  @keyframes presentation-go-fullscreen {
    0% { transform: translate(15%, 0) scale(.57) rotateY(-0.5deg); }
    100% { transform: translate(0, 0) scale(1) rotateY(0deg); }
  }

  @keyframes to-backward-right {
    0% { transform: translate(0, 0); z-index: 10; }
    50% { transform: translate(50%, 0) rotateY(-1.5deg) scale(.7); }
    100% { transform: translate(0, 0) scale(.7); z-index: 1; }
  }

  @keyframes to-backward-left {
    0% { transform: translate(0, 0); z-index: 10; }
    50% { transform: translate(-50%, 0) rotateY(1.5deg) scale(.7); z-index: 1; }
    100% { transform: translate(0, 0) scale(.7); }
  }

  @keyframes to-forward-right {
    0%, 100% {
      width: 100%;
      margin-left: -50%;
    }

    0% { transform: translate(0, 0) rotateY(-1.5deg) scale(.7); z-index: 1; }
    50% { transform: translate(25%, 0) rotateY(-1.5deg) scale(.7); }
    75% { transform: translate(0, 0); z-index: 1; }
    100% { transform: translate(0, 0); z-index: 10; }
  }

  @keyframes to-forward-left {
    0%, 100% {
      width: 100%;
      margin-left: -50%;
    }

    0% { transform: translate(0, 0) rotateY(1.5deg) scale(.7); z-index: 1; }
    50% { transform: translate(-25%, 0) rotateY(1.5deg) scale(.7); }
    75% { transform: translate(0, 0); z-index: 10; }
    100% { transform: translate(0, 0); }
  }
</style>

