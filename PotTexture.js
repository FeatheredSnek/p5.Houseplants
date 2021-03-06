/* Pot texture object, stores its parameters and the actual image generated
from these params. The image is a simple dark linear gradient coming from
the bottom and a lighter line at the fixed height that serves as a highlight.
With no arguments passed into the constructor, a random
brown pot texture is generated */

class PotTexture {
  constructor (customParams, baseColor) {
    let params = customParams || PotTexture.getDefaultParams()

    this.baseColor = baseColor || color('brown')
    this.shadowIntensity = params.shadowIntensity
    this.highlightIntensity = params.highlightIntensity

    this.image = this.generateImage()
  }

  generateImage () {
    let x, y;
    let img = new p5.Image(64,64)
    img.loadPixels()

    let gradientColorA = helpers.colorToRGBA(this.baseColor)
    let gradientColorB = helpers.colorToRGBA(color('black'))

    // first pass - fill backdrop with linear gradient
    let yChunk = round(255 / img.height)
    for (y = 0; y < img.height; y++) {
      for (x = 0; x < img.width; x++) {
        let currentGradientColor = {
          r: gradientColorB.r,
          g: gradientColorB.g,
          b: gradientColorB.b,
          a: y * this.shadowIntensity * yChunk
        }
        let mixedColor = helpers.blendColors(currentGradientColor, gradientColorA)
        helpers.writeColor(img, x, y, mixedColor.r, mixedColor.g, mixedColor.b, mixedColor.a);
      }
    }

    // second pass - generate highlight line at the fixed level
    // the line consists of 2 gradients fading into opposide sides
    let highlightLevel = 0.8
    let highlightWidth = 5 // in pixels
    let highlightChunk = 40 * this.highlightIntensity
    for (y = 0; y < img.height; y++) {
      for (x = 0; x < img.width; x++) {
        if (y == img.height - round(img.height * highlightLevel)) {
          // upper part of the line
          for (let i = 0; i < round(highlightWidth / 2); i++) {
            let currentY = y + i
            let backdropColor = helpers.getColor(img, x, currentY)
            let highlightColor = {
              r: 255,
              b: 255,
              g: 255,
              a: highlightChunk * (round(highlightWidth / 2) - i)
            }
            let mixedColor = helpers.blendColors(highlightColor, backdropColor)
            helpers.writeColor(img, x, currentY, mixedColor.r, mixedColor.g, mixedColor.b, 255);
          }
          // lower part of the line (starts at 1 to avoid overlap)
          for (let i = 1; i < round(highlightWidth / 2); i++) {
            let currentY = y - i
            let backdropColor = helpers.getColor(img, x, currentY)
            let highlightColor = {
              r: 255,
              b: 255,
              g: 255,
              a: highlightChunk * (round(highlightWidth / 2) - i)
            }
            let mixedColor = helpers.blendColors(highlightColor, backdropColor)
            helpers.writeColor(img, x, currentY, mixedColor.r, mixedColor.g, mixedColor.b, 255);
          }
        }
      }
    }

    img.updatePixels();
    return img
  }

  static getDefaultParams () {
    return {
      baseColor: 'brown', // see helpers for the range of browns used
      shadowIntensity: 0.5, // 0.3-0.6 (intensity of the darkening gradient)
      highlightIntensity: 0.66, // 0.5-0.8 (intensity of the lightening gradient)
    }
  }

  static getRandomParams () {
    return {
      baseColor: helpers.getRandomBrown(),
      shadowIntensity: random(0.3, 0.6),
      highlightIntensity: random(0.5, 0.8)
    }
  }

  log (print) {
    let p = {
      baseColor: helpers.colorToRGB(this.baseColor),
      shadowIntensity: this.shadowIntensity,
      highlightIntensity: this.highlightIntensity
    }
    if (print) console.log(p);
    return p
  }

}
