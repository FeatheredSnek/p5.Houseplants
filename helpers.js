const helpers = {

  vertexRotateZXY (v, xAngle, yAngle, zAngle) {
    let rm = {
      x1: cos(zAngle) * cos(yAngle),
      x2: cos(zAngle) * sin(yAngle) * sin(xAngle) - sin(zAngle) * cos(xAngle),
      x3: cos(zAngle) * sin(yAngle) * cos(xAngle) + sin(zAngle) * sin(xAngle),
      y1: sin(zAngle) * cos(yAngle),
      y2: sin(zAngle) * sin(yAngle) * sin(xAngle) + cos(zAngle) * cos(xAngle),
      y3: sin(zAngle) * sin(yAngle) * cos(xAngle) - cos(zAngle) * sin(xAngle),
      z1: sin(yAngle) * -1,
      z2: cos(yAngle) * sin(xAngle),
      z3: cos(yAngle) * cos(xAngle)
    }
    let vm = {
      x: v.x,
      y: v.y,
      z: v.z
    }
    let result = {
      x: 0,
      y: 0,
      z: 0
    }
    result.x = rm.x1 * vm.x + rm.x2 * vm.y + rm.x3 * vm.z
    result.y = rm.y1 * vm.x + rm.y2 * vm.y + rm.y3 * vm.z
    result.z = rm.z1 * vm.x + rm.z2 * vm.y + rm.z3 * vm.z
    return createVector(result.x, result.y, result.z)
  },

  verticesRotateZXY (vertices, xAngle, yAngle, zAngle) {
    vertices.forEach(v => {
      let rotated = helpers.vertexRotateZXY(v, HALF_PI, 0, 0)
      v.x = rotated.x
      v.y = rotated.y
      v.z = rotated.z
    })
  },

  translateVertices (vertices, translationVector) {
    vertices.forEach(v => {
      v.x = v.x + translationVector.x
      v.y = v.y + translationVector.y
      v.y = v.y + translationVector.z
    })
  },

  drawAxes () {
    strokeWeight(1)
    stroke('red')
    line(-100, 0, 0, 100, 0, 0)
    stroke('green')
    line(0, -100, 0, 0, 100, 0)
    stroke('blue')
    line(0, 0, -100, 0, 0, 100)
  },

  testTexture () {
    let img = createImage(32, 32);
    img.loadPixels();
    let chunk = 255 / img.width
    for (let i = 0; i < img.width; i++) {
      for (let j = 0; j < img.height; j++) {
        helpers.writeColor(img, i, j, i*chunk, j*chunk, 0, 255)
      }
    }
    img.updatePixels();
    return img
  },

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
      a: alpha(color)
    }
  },

  colorFromRGB (obj) {
    return color(obj.r, obj.g, obj.b)
  },

  colorFromRGBA (obj) {
    return color(obj.r, obj.g, obj.b, obj.a)
  }
}
