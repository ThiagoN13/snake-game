// Converts a #ffffff hex string into an [r,g,b] array
function h2r (hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : null
}

// Inverse of the above
function r2h (rgb) {
  return "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1)
}

// Interpolates two [r,g,b] colors and returns an [r,g,b] of the result
// Taken from the awesome ROT.js roguelike dev library at
function _interpolateColor (color1, color2, factor) {
  if (arguments.length < 3) {
    factor = 0.5
  }
  let result = color1.slice()
  for (let i = 0; i < 3; i++) {
    result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]))
  }
  return result
}

function rgb2hsl (color) {
  const r = color[0] / 255
  const g = color[1] / 255
  const b = color[2] / 255

  let max = Math.max(r, g, b)
  let min = Math.min(r, g, b)
  var h, s, l = (max + min) / 2

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min
    s = (l > 0.5 ? d / (2 - max - min) : d / (max + min))
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break;
      case g:
        h = (b - r) / d + 2
        break;
      case b:
        h = (r - g) / d + 4
        break;
    }
    h /= 6
  }

  return [h, s, l]
}

function hue2rgb(p, q, t) {
  if (t < 0) t += 1
  if (t > 1) t -= 1
  if (t < 1 / 6) return p + (q - p) * 6 * t
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
  return p;
}

function hsl2rgb (color) {
  let l = color[2]

  if (color[1] == 0) {
    l = Math.round(l * 255)
    return [l, l, l]
  } else {
    let s = color[1];
    let q = (l < 0.5 ? l * (1 + s) : l + s - l * s)
    let p = 2 * l - q
    let r = hue2rgb(p, q, color[0] + 1 / 3)
    let g = hue2rgb(p, q, color[0])
    const b = hue2rgb(p, q, color[0] - 1 / 3)
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
  }
}

function interpolateHSL (color1, color2, factor) {
  if (arguments.length < 3) {
    factor = 0.5
  }
  let hsl1 = rgb2hsl(color1)
  const hsl2 = rgb2hsl(color2)
  for (var i = 0; i < 3; i++) {
    hsl1[i] += factor * (hsl2[i] - hsl1[i])
  }
  return hsl2rgb(hsl1)
}

function obtainArrayOfInterpolatedColors (color1, color2, step) {
  let scol = h2r('#5e4fa2')
  let ecol = h2r('#f79459')

  var factorStep = 1 / (step - 1);
  let arrayOfColors = []
  for (let i = 0; i < step; i++) {
    let icol = _interpolateColor(scol, ecol, factorStep * i)
    let hcol = r2h(icol)
    arrayOfColors.push(hcol)
  }
  return arrayOfColors
}

function getRandomColor () {
  let letters = '0123456789ABCDEF'.split('')
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

export {
  getRandomColor,
  obtainArrayOfInterpolatedColors
}