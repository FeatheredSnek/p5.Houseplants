const parser = {

  plantToCode (data) {
    let json = JSON.stringify(
      data,
      (k, v) => {return typeof v == 'number' ? Number.parseFloat(v.toFixed(2)) : v}
    )
    return parser.encodeJSON(json)
  },

  encodeJSON (json) {
    for (let code of parser.codes) {
      json = json.replaceAll(code[0], code[1])
    }
    return json
  },

  decodeJSON (str) {
    for (let code of parser.codes) {
      str = str.replaceAll(code[1], code[0])
    }
    return str
  },

  parseInput (inputCode) {
    let inputJSON = parser.decodeJSON(inputCode)
    let isValid = false
    try {
      let dataObject = JSON.parse(inputJSON)
      let schemaObject = JSON.parse(parser.schema)
      isValid = parser.validateStructure(dataObject, schemaObject)
      if (!isValid) {
        console.error('data structure error')
        return false
      }
      else {
        return dataObject
      }
    }
    catch {
      console.error('json syntax error')
      return false
    }
  },

  validateStructure (obj, schema) {
    for (let p in schema) {
      let hasProp = obj.hasOwnProperty(p)
      if (!hasProp) return false
      let isObject = schema[p] instanceof Object && !(schema[p] instanceof Array)
      let isArray = (schema[p] instanceof Array)
      if (isObject) {
        parser.validateStructure(obj[p], schema[p])
      }
      else if (isArray) {
        for (let subobj of obj[p]) {
          parser.validateStructure(subobj, schema[p][0])
        }
      }
      else if (p != 'outline' && typeof obj[p] != 'number'){
        return false
      }
    }
    return true
  },

  codes: [
    [`{"stalkCount":`, `>`],
    [`,"stalkSpread":`, `Sd`],
    [`,"baseBrown":{`, `Q`],
    [`"r":`, `;`],
    [`,"g":`, `&`],
    [`,"b":`, `~`],
    [`,"a":`, `'`],
    [`},"baseGreen":{`, `K`],
    [`},"leafTextureData":{`, `LTD`],
    [`"colors":{`, `CL`],
    [`"baseColor":{`, `BC`],
    [`},"gradientColor":{`, `GC`],
    [`},"veinColor":{`, `VC`],
    [`}},"params":{`, `ltP`],
    [`"gradientFactor":`, `GF`],
    [`,"verticalVeinWidth":`, `VVW`],
    [`,"veinCount":`, `VN`],
    [`,"veinSlope":`, `VS`],
    [`,"veinThickness":`, `VT`],
    [`}},"potTextureData":{`, `PTD`],
    [`},"shadowIntensity":`, `s%`],
    [`,"highlightIntensity":`, `h%`],
    [`},"potData":{`, `PD`],
    [`"position":{`, `#`],
    [`"x":`, `X`],
    [`,"y":`, `Y`],
    [`,"z":`, `Z`],
    [`},"rotation":{`, `@`],
    [`},"meshParams":{`, `*`],
    [`"height":`, `hT`],
    [`,"bottomRadius":`, `BR`],
    [`,"slant":`, `/`],
    [`,"extrusionWidth":`, `Ow`],
    [`,"extrusionLevel":`, `Ol`],
    [`,"resolution":`, `?`],
    [`}},"stalkData":[{`, `$S`],
    [`"length":`, `_`],
    [`,"curvature":`, `(`],
    [`,"thickness":`, `=`],
    [`}},{`, `+`],
    [`}}],"leafData":[{`, `$L`],
    [`,"width":`, `|`],
    [`,"skew":`, `^`],
    [`,"outline":`, 'U'],
    [`null`, `!`],
    [`}}]}`, `<`]
  ],

  testPlant: `>3Sd4.418860254376554Q;189&108~29K;58&127~34LTDCLBC;58&127~34'255GC;104&186~28'255VC;165&230~0'255ltPGF1.52VVW8.09VN4VS0.73VT2.52PTDBC;189&108~29s%0.48h%0.65PD#X0Y0Z0@X0Y0Z0*hT87.18BR32.75/0.11Ow9.79Ol0.53?5$S#X4.92Y78.46Z0@X0Y6.28Z0*_158.74?3(0.19=5+#X-2.19Y78.46Z3.92@X0Y4.35Z0*_154.3?3(0.12=5+#X-1.95Y78.46Z-4.53@X0Y2.32Z0*_100.16?3(0.18=5$L#X42.33Y176.62Z0@X0.01Y6.31Z0.04*_78.17|58.48?6^0.59=1.35(0.88U!+#X-10.18Y178.54Z25.02@X0.1Y4.66Z0.05*_71.82|73.03?6^0.58=1.52(0.77U!+#X-16.87Y141.05Z-20.71@X0.07Y2.28Z-0.07*_71.41|60.86?6^0.59=1.56(0.73U!<`,

  schema: `
  {
    "stalkCount": 0,
    "stalkSpread": 0,
    "baseBrown": {
      "r": 0,
      "g": 0,
      "b": 0
    },
    "baseGreen": {
      "r": 0,
      "g": 0,
      "b": 0
    },
    "leafTextureData": {
      "colors": {
        "baseColor": {
          "r": 0,
          "g": 0,
          "b": 0,
          "a": 0
        },
        "gradientColor": {
          "r": 0,
          "g": 0,
          "b": 0,
          "a": 0
        },
        "veinColor": {
          "r": 0,
          "g": 0,
          "b": 0,
          "a": 0
        }
      },
      "params": {
        "gradientFactor": 0,
        "verticalVeinWidth": 0,
        "veinCount": 0,
        "veinSlope": 0,
        "veinThickness": 0
      }
    },
    "potTextureData": {
      "baseColor": {
        "r": 0,
        "g": 0,
        "b": 0
      },
      "shadowIntensity": 0,
      "highlightIntensity": 0
    },
    "potData": {
      "position": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "meshParams": {
        "height": 0,
        "bottomRadius": 0,
        "slant": 0,
        "extrusionWidth": 0,
        "extrusionLevel": 0,
        "resolution": 0
      }
    },
    "stalkData": [{
      "position": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "meshParams": {
        "length": 0,
        "resolution": 0,
        "curvature": 0,
        "thickness": 0
      }
    }],
    "leafData": [{
      "position": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "meshParams": {
        "length": 0,
        "width": 0,
        "resolution": 0,
        "skew": 0,
        "thickness": 0,
        "curvature": 0,
        "outline": 0
      }
    }]
  }
  `
}
