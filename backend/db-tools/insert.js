const admin = require("firebase-admin")
const ImageUtils = require("./ImageUtils")
const ColorUtils = require("./ColorUtils")
const fs = require("fs")

const serviceAccount = require("./keys/ton-pixels-deddy-firebase-adminsdk-qw9uz-2a1c8a4bbe.json")
// const serviceAccount = require("./keys/open-defi-notifications-firebase-adminsdk-26j10-8c708110be.json")

// careful, never run this on prod without knowing exactly what this does!!!
async function main() {

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://ton-pixels-deddy-default-rtdb.firebaseio.com"
    });

    // execute carefully!

    admin.database().ref('pixels').set(null)

    const pixels = await ImageUtils.imageToPixelsJson('./data/demo.png')

    // fs.writeFileSync('./data/demo.json', JSON.stringify(pixels))

    const colors = {}

    for (const pixel of pixels) {

        colors[ColorUtils.rgbToHex(pixel.r, pixel.g, pixel.b)] = pixel

    }

    const allColors = []
    const colorIndex = {}
    const hexColors = Object.keys(colors)

    for (let i = 0; i < hexColors.length; i++) {

        const hexColor = hexColors[i];

        allColors[i] = {
            hex: hexColor,
            rgb: colors[hexColor]
        }

        colorIndex[hexColor] = i

    }

    for (let i = 0; i < pixels.length; i++) {

        const pixel = pixels[i]

        pixels[i] = {
            index: i,
            color: colorIndex[ColorUtils.rgbToHex(pixel.r, pixel.g, pixel.b)]
        }
    }

    fs.writeFileSync('./data/pixels.json', JSON.stringify(pixels))

    /*


      await admin.database().ref('metadata/colors').update(
          allColors,
          () => {

              console.log('finished')

          }

      );*/


}

main()
