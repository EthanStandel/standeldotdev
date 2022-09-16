export const color = {
  // https://stackoverflow.com/a/67222423/8650500
  // thanks danielm2402
  hsvToRgb: (hue: number, saturation: number, value: number) => {
    const h = hue / 360, s = saturation / 100, v = value / 100
    let r, g, b, i, f, p, q, t;
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0: r = v, g = t, b = p; break;
      case 1: r = q, g = v, b = p; break;
      case 2: r = p, g = v, b = t; break;
      case 3: r = p, g = q, b = v; break;
      case 4: r = t, g = p, b = v; break;
      case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round((r ?? 0) * 255),
        g: Math.round((g ?? 0) * 255),
        b: Math.round((b ?? 0) * 255)
    };
  },

  // https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
  // thanks Paul S. & Adam Price
  rgbToHsv: (r: number, g: number, b: number) => {
    var max = Math.max(r, g, b), min = Math.min(r, g, b),
        d = max - min,
        h,
        s = (max === 0 ? 0 : d / max),
        v = max / 255;

    switch (max) {
        case min: h = 0; break;
        case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
        case g: h = (b - r) + d * 2; h /= 6 * d; break;
        case b: h = (r - g) + d * 4; h /= 6 * d; break;
        default: h = 0
    }

    return {
        h: h * 360,
        s: s * 100,
        v: 100 - v * 100
    };
  },

  hsvToRgbCss: (h: number, s: number, v: number) => {
    const { r, g, b } = color.hsvToRgb(h, s, v);
    return `rgb(${r},${g},${b})`;
  },

  hueToRgbCss: (hue: number) => {
    const { r, g, b } = color.hsvToRgb(hue, 100, 100);
    return `rgb(${r},${g},${b})`;
  },

  rgbToHex: ({ r, g, b }: { r: number, g: number, b: number }) => {
    const red = Math.round(r).toString(16);
    const green = Math.round(g).toString(16);
    const blue = Math.round(b).toString(16);

    return "#"
      + (red.length === 1 ? 0 + red : red)
      + (green.length === 1 ? 0 + green : green)
      + (blue.length === 1 ? 0 + blue : blue);
  },

  hexToRgb: (hex: string) => {
    const fullHex = hex.slice(-6);
    const r = parseInt(fullHex.slice(0, 2), 16);
    const g = parseInt(fullHex.slice(2, 4), 16);
    const b = parseInt(fullHex.slice(4, 6), 16);

    return { r, g, b };
  }
};
