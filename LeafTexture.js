class LeafTexture {
  constructor (customParams, baseColor) {
    let base = baseColor || color('green')
    let randomizedColors = LeafTexture.generateLeafColors(base)
    this.baseColor = randomizedColors.baseColor
    this.gradientColor = randomizedColors.gradientColor
    this.veinColor = randomizedColors.veinColor

    let params = customParams || LeafTexture.getDefaultParams()
    this.gradientFactor = params.gradientFactor
    this.verticalVeinWidth = params.verticalVeinWidth
    this.veinCount = params.veinCount
    this.veinSlope = params.veinSlope
    this.veinThickness = params.veinThickness

    this.image = this.generateImage()
  }

  generateImage() {
    let img = new p5.Image(32,64)
    img.loadPixels()
    let x, y;

    let gradientColorA = this.baseColor
    let gradientColorB = this.gradientColor
    let veinColor = this.veinColor

    // first pass, fill backdrop with linear gradient
    let yChunk = round(255 / img.height)
    for (y = 0; y < img.height; y++) {
      for (x = 0; x < img.width; x++) {
        let currentGradientColor = {
          r: gradientColorB.r,
          g: gradientColorB.g,
          b: gradientColorB.b,
          a: y * this.gradientFactor * yChunk
        }
        let mixedColor = helpers.blendColors(currentGradientColor, gradientColorA)
        helpers.writeColor(img, x, y, mixedColor.r, mixedColor.g, mixedColor.b, mixedColor.a);
      }
    }

    // second pass - vertical vein
    for (y = 0; y < img.height; y++) {
      for (x = 0; x < img.width; x++) {
        // activate for every pixel on first column
        if (x == 0) {
          let yfactor = max(0, y - 12)
          for (let i = 0; i < this.verticalVeinWidth; i++) {
            let currentX = x+i
            let backdropColor = helpers.getColor(img, currentX, y)
            let veinAlpha = max(0, 255 - (i * (60 - this.verticalVeinWidth * 2) + yfactor * 4))
            let currentVeinColor = {
              r: veinColor.r,
              b: veinColor.b,
              g: veinColor.g,
              a: veinAlpha
            }
            let mixedColor = helpers.blendColors(currentVeinColor, backdropColor)
            // console.log(veinAlpha)
            helpers.writeColor(img, currentX, y, mixedColor.r, mixedColor.g, mixedColor.b, 255);
            // let green = 255 - (i * 40 + yfactor * 4)
          }
        }
      }
    }

    // third (multi)pass - horizontal veins
    let veinSpacing = round(img.height * 0.8 / this.veinCount)
    // pass the image for every vein
    for (let v = 0; v < this.veinCount; v++) {
      let writeCounter = 0
      for (y = 0; y < img.height; y++) {
        for (x = 0; x < img.width; x++) {
          // activate when a pixel lies on a computed line
          // determined by the appropriate linear function
          if (y == round(x * this.veinSlope + veinSpacing * v) && x < img.width - 2) {
            // write for n tiems, everytime lower the effects intensity
            // every vein increase this limiting factor
            let fader = writeCounter * (6 + 3 * v)
            writeCounter += 1
            // darken this and neighboring pixels
            for (let i = 0; i < this.veinThickness; i++) {
              let currentY = y+i
              let backdropColor = helpers.getColor(img, x, currentY)
              let veinAlpha = max(0, 255 - (i * 30 + fader))
              let currentVeinColor = {
                r: veinColor.r,
                b: veinColor.b,
                g: veinColor.g,
                a: veinAlpha
              }
              let mixedColor = helpers.blendColors(currentVeinColor, backdropColor)
              helpers.writeColor(img, x, currentY, mixedColor.r, mixedColor.g, mixedColor.b, 255);
            }
          }
        }
      }
    }
    img.updatePixels()
    // shift the generated result to the right, mirror it on the right,
    // return the combined result
    return helpers.mirrorAndCombine(img)
  }

  redraw () {
    this.image = this.generateImage()
  }

  static generateLeafColors (base) {
    colorMode(HSB, 360, 100, 100)
    let lightened = color(
      hue(base) + random(-20,10),
      saturation(base) + random(0, 40),
      brightness(base) + random(10, 30)
    )
    let vein = color(
      hue(base) + random(-30, 10),
      saturation(base) + random(10, 50),
      random(80, 100)
    )
    colorMode(RGB, 255)
    // colors as rgb storing objects
    let baseColor = {
      r: red(base),
      g: green(base),
      b: blue(base),
      a: 255
    }
    let gradientColor = {
      r: red(lightened),
      g: green(lightened),
      b: blue(lightened),
      a: 255
    }
    let veinColor = {
      r: red(vein),
      g: green(vein),
      b: blue(vein),
      a: 255
    }
    return {baseColor, gradientColor, veinColor}
  }

  static getDefaultParams () {
    return {
      gradientFactor: 1,
      verticalVeinWidth: 6,
      veinCount: 4,
      veinSlope: 0.5,
      veinThickness: 4
    }
  }

  static getRandomParams () {
    return {
      gradientFactor: random(1, 1.6), // intensity multiplier of the secondary color
      verticalVeinWidth: random(3, 10), // half of the width in pixels
      veinCount: random([0, 3, 3, 4, 4, 4, 4, 4, 5, 5, 6]), // array for non-uniform distribution
      veinSlope: random(0.3, 1.1), // 0 for horizontal, inf for vertical
      veinThickness: random(2, 10) // in pixels
    }
  }
}
