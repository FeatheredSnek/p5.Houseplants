// Parser script used for conversions between short-ish plant codes and full
// data objects which can be passed into a plant instance constructor.

const parser = {

  // Wrapper function that truncates the floats to 2 decimal places (which is
  // more than enough precision for the job), converts the data object to json
  // and then encodes the result.
  plantToCode (data) {
    let json = JSON.stringify(
      data,
      (k, v) => {return typeof v == 'number' ? Number.parseFloat(v.toFixed(2)) : v}
    )
    return parser.encodeJSON(json)
  },

  // Encoding and decoding by simple substitution (table below).
  // The codes use as much symbols as possible to avoid ambiguity and to shorten
  // the result.
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

  // Validation wrapper, uses try-catch to handle JSON parsing errors
  // parseInput (inputCode) {
  parseInput (inputCode) {
    let inputJSON = parser.decodeJSON(inputCode)
    try {
      let dataObject = JSON.parse(inputJSON)
      let schemaObject = JSON.parse(parser.schema)
      parser.validateStructure(dataObject, schemaObject)
      return dataObject
    }
    catch (err) {
      console.error(err.message)
      return false
    }
  },

  // Validator that ensures proper data structure.
  // It recursively travels the template's properties and checks if their values
  // have the same structure in the validated object. If it encounters a primitive
  // it checks if this primitive is a number (instance params are only int and float)
  validateStructure (obj, schema) {
    for (let p in schema) {
      let hasProp = obj.hasOwnProperty(p)
      if (!hasProp) return new Error('Validation error: invalid data structure')
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
        return new Error('Validation error: primitive value is not a number')
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
