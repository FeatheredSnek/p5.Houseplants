const helpers = {

  mirrorAndCombine (source) {
    let output = createImage(source.width * 2, source.height)
    output.copy(source, 0, 0, source.width, source.height, source.width, 0, source.width, source.height)
    output.loadPixels()
    for (let y = 0; y < output.height; y++) {
      for (let x = 0; x < source.width; x++) {
        let mirror = helpers.getColor(output, output.width-x-1, y)
        helpers.writeColor(output, x, y, mirror.r, mirror.g, mirror.b, 255);
      }
    }
    output.updatePixels()
    return output
  },

  writeColor (image, x, y, red, green, blue, alpha) {
    let index = (x + y * image.width) * 4;
    image.pixels[index] = red;
    image.pixels[index + 1] = green;
    image.pixels[index + 2] = blue;
    image.pixels[index + 3] = alpha;
  },

  getColor (image, x, y) {
    let index = (x + y * image.width) * 4;
    return {
      r: image.pixels[index],
      g: image.pixels[index + 1],
      b: image.pixels[index + 2],
      a: image.pixels[index + 3]
    }
  },

  blendColors (s, b) {
    let source = helpers.normalizeColor(s)
    let backdrop = helpers.normalizeColor(b)
    let ro = source.r * source.a + backdrop.r * backdrop.a * (1 - source.a)
    let go = source.g * source.a + backdrop.g * backdrop.a * (1 - source.a)
    let bo = source.b * source.a + backdrop.b * backdrop.a * (1 - source.a)
    let ao = source.a + backdrop.a * (1 - source.a)
    return {
      r: ro / ao * 255,
      g: go / ao * 255,
      b: bo / ao * 255,
      a: ao * 255
    }
  },

  normalizeColor (c) {
    return {
      r: c.r / 255,
      g: c.g / 255,
      b: c.b / 255,
      a: c.a / 255
    }
  },

  getRandomGreen () {
    colorMode(HSB, 360, 100, 100)
    let c = color(
      random(90, 150),
      random(60,100),
      random(35, 70)
    )
    colorMode(RGB, 255)
    return c
  },

  getRandomBrown () {
    colorMode(HSB, 360, 100, 100)
    let c = color(
      random(25, 42),
      random(55, 100),
      random(40, 75)
    )
    colorMode(RGB, 255)
    return c
  },

  colorToRGB (color) {
    return {
      r: red(color),
      g: green(color),
      b: blue(color)
    }
  },

  colorToRGBA (color) {
    return {
      r: red(color),
      g: green(color),
      b: blue(color),
      a: 255
    }
  },

  colorFromRGB (obj) {
    return color(obj.r, obj.g, obj.b)
  },

  colorFromRGBA (obj) {
    return color(obj.r, obj.g, obj.b, obj.a)
  },

  vectorToValues (vec) {
    return {
      x: vec.x,
      y: vec.y,
      z: vec.z
    }
  },

  vectorFromValues (obj) {
    return createVector(obj.x, obj.y, obj.z)
  }
}
