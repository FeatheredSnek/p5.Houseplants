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

    let gradientColorA = {
      r: red(this.baseColor),
      g: green(this.baseColor),
      b: blue(this.baseColor),
      a: 255
    }
    let gradientColorB = {r: 0, g: 0, b: 0, a: 255}

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

    // second pass - generate highlight line at fixed level
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
      baseColor: 'brown',
      shadowIntensity: 0.5,
      highlightIntensity: 0.66,
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
      baseColor: {
        r: red(this.baseColor),
        g: green(this.baseColor),
        b: blue(this.baseColor),
      },
      shadowIntensity: this.shadowIntensity,
      highlightIntensity: this.highlightIntensity
    }
    if (print) console.log(p);
    return p
  }

}
