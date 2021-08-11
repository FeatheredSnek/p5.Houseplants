const parser = {

  minify (data) {
    parser.minifyColors(data.baseBrown)
    parser.minifyColors(data.baseGreen)
    for (let c in data.leafTextureData.colors) {
      parser.minifyColors(data.leafTextureData.colors[c])
    }
    parser.minifyColors(data.potTextureData.baseColor)
    parser.minifyValues(data.leafTextureData.params)
    parser.minifyValues(data.potTextureData)
    for (let p in data.potData) {
      parser.minifyValues(data.potData[p])
    }
    data.stalkData.forEach(stalk => {
      for (let p in stalk) {
        parser.minifyValues(stalk[p])
      }
    })
    data.leafData.forEach(leaf => {
      for (let p in leaf) {
        parser.minifyValues(leaf[p])
      }
    })
  },

  minifyColors (cObj) {
    for (let p in cObj) {
      cObj[p] = round(cObj[p])
    }
  },

  minifyValues (obj) {
    for (let p in obj) {
      if (typeof(obj[p]) === 'number') {
        obj[p] = Number.parseFloat(obj[p].toFixed(2))
      }
    }
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

}
