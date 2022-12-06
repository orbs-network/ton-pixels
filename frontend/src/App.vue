<template>

  <div :class="(darkMode ? 'dark' : 'light')" class="page">

    <div class="loading" v-if="isLoading">
      <img
          src="https://media3.giphy.com/media/L05HgB2h6qICDs5Sms/giphy.gif?cid=ecf05e478m15g7rgia18ipg9menvhnn4ahik4vcjd5zzr33r&rid=giphy.gif&ct=s"/>
    </div>

    <div v-else>

      <canvas id="canvas" width="1000" height="1000"></canvas>

      <div class="pixel" style="">

<!--        <div height="120%" width="120%">

          <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" height="120%" width="120%">

            <g stroke-opacity=".6" stroke-width="2">
              <g stroke="#000">
                <path d="m3 9v-6h6"></path>
                <path d="m14.9999 3h6v6"></path>
                <path d="m20.9999 15.0001v6h-6"></path>
                <path d="m9 21.0001h-6v-6"></path>
              </g>
              <path d="m1 9v-8h8" stroke="#fff"></path>
              <path d="m15 1h8v8" stroke="#fff"></path>
              <path d="m23 15v8h-8" stroke="#fff"></path>
              <path d="m9 23h-8v-8" stroke="#fff"></path>
            </g>

          </svg>

        </div>-->

      </div>

    </div>

  </div>

</template>

<script>

import {get, getDatabase, ref} from "firebase/database";
import {initializeApp} from "firebase/app";
import './scss/style.scss'
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

    const pixelsRef = ref(fbDb, 'pixels')

    const colorsRef = ref(fbDb, 'metadata/colors')

    this.colors = (await get(colorsRef)).val()

    this.pixels = (await get(pixelsRef)).val()

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

      const drawPixel = (pixel) => {

        const x = pixel.index % 1000
        const y = parseInt(pixel.index / 1000)

        const index = 4 * (canvas.width * y + x);

        const colorRGB = this.colors[pixel.color].rgb

        data[index] = colorRGB.r
        data[index + 1] = colorRGB.g
        data[index + 2] = colorRGB.b
        data[index + 3] = 255

      }

      function swapBuffer() {
        ctx.putImageData(image, 0, 0);
      }

      for (const pixel of this.pixels) {

        drawPixel(pixel);

      }

      swapBuffer();

    }

  }

}
</script>
