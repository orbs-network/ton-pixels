<template>

  <div :class="(darkMode ? 'dark' : 'light')" class="page">

    <div class="loading" v-if="isLoading">
      <img
          src="https://media3.giphy.com/media/L05HgB2h6qICDs5Sms/giphy.gif?cid=ecf05e478m15g7rgia18ipg9menvhnn4ahik4vcjd5zzr33r&rid=giphy.gif&ct=s"/>
    </div>

    <div v-else>

      <canvas id="canvas" width="1000" height="1000"></canvas>

    </div>

  </div>

</template>

<script>

import {get, getDatabase, ref} from "firebase/database";
import {initializeApp} from "firebase/app";
import './scss/style.scss'
import ColorUtils from './utils/ColorUtils'
import panzoom from 'panzoom'

const numberFormatter = Intl.NumberFormat('en');

export default {
  name: 'App',

  components: {},

  data() {
    return {
      isLoading: false,
      darkMode: false,
      colors: [],
      pixels: {}
    }
  },

  async mounted() {

    document.documentElement.dataset.scroll = window.scrollY;

    document.addEventListener('scroll', () => {
      document.documentElement.dataset.scroll = window.scrollY;
    });


    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
      apiKey: "AIzaSyCcgWr3lMK417rfOFyCEopsy3Lj6ax3Xew",
      authDomain: "ton-pixels-deddy.firebaseapp.com",
      projectId: "ton-pixels-deddy",
      storageBucket: "ton-pixels-deddy.appspot.com",
      messagingSenderId: "805065151568",
      appId: "1:805065151568:web:fbfaab16f2f155d0b16d55",
      measurementId: "G-LYZJNG51S3"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    const fbDb = getDatabase(app)

    this.pixelsRef = ref(fbDb, 'pixels')

    const colorsRef = ref(fbDb, 'colors')

    this.colors = (await get(colorsRef)).val()

    this.pixels = []

    await this.initCanvas()

  },
  computed: {},
  methods: {

    initCanvas() {

      const canvas = document.getElementById("canvas")

      panzoom(canvas)

      const ctx = canvas.getContext('2d')

      // to increase performance createImageData method
      // should be executed once e.g. before drawing
      const image = ctx.createImageData(canvas.width, canvas.height);
      const data = image.data;

      function drawPixel(x, y, color) {
        const roundedX = Math.round(x);
        const roundedY = Math.round(y);

        const index = 4 * (canvas.width * roundedY + roundedX);

        data[index + 0] = color.r;
        data[index + 1] = color.g;
        data[index + 2] = color.b;
        data[index + 3] = color.a;
      }

      function swapBuffer() {
        ctx.putImageData(image, 0, 0);
      }

      for (let x = 0; x < 1000; ++x) {

        for (let y = 0; y < 1000; ++y) {

          const color = this.colors[Math.floor(Math.random() * 32)];

          drawPixel(x, y, color);
        }

        swapBuffer();


      }

    }

  }

}
</script>
