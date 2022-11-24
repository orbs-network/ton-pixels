const PNG = require('pngjs').PNG
const fs = require("fs")

class ImageUtils {

    static imageToPixelsJson(imagePath) {

        return new Promise(resolve => {

            fs.createReadStream(imagePath).pipe(new PNG({filterType: 4})).on('parsed', function () {

                const pixels = []

                for (let y = 0; y < this.height; y++) {

                    for (let x = 0; x < this.width; x++) {

                        const idx = (this.width * y + x) << 2
                        const r = this.data[idx]
                        const g = this.data[idx + 1]
                        const b = this.data[idx + 2]
                        pixels.push({r, g, b})

                    }

                }

                resolve(pixels)

            })

        })

    }

}

module.exports = ImageUtils
