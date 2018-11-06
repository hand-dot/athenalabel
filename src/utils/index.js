import UAParser from 'ua-parser-js';

const parser = new UAParser();
const deviceType = parser.getDevice().type;
const browser = parser.getBrowser().name;

export default {
  isMobile() {
    return deviceType === 'mobile';
  },
  isIe() {
    return browser === 'IE';
  },
  zenkaku2hankaku(val) {
    if (typeof val !== 'string') return val;
    const regex = /[Ａ-Ｚａ-ｚ０-９！＂＃＄％＆＇（）＊＋，－．／：；＜＝＞？＠［＼］＾＿｀｛｜｝]/g;
    return val
      .replace(regex, s => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
      .replace(/[‐－―−]/g, '-') // ハイフンなど
      .replace(/[～〜]/g, '~') // チルダ
      // スペース;
      .replace(/　/g, ' '); // eslint-disable-line 
  },
  splitByLength(str, length) {
    if (!str || !length || length < 1) {
      return [];
    }
    const regexPattern = new RegExp(
      `(?:[\uD800-\uDBFF][\uDC00-\uDFFF]|[^\uD800-\uDFFF]){1,${length}}`,
      'g',
    );

    return str.match(regexPattern) || [];
  },
  mm2pt(mm) {
    if (mm === null || isNaN(mm)) throw Error('Error: mm2pt unexpected argument'); // eslint-disable-line 
    // https://www.ddc.co.jp/words/archives/20090701114500.html
    const pointRatio = 2.8346;
    return parseFloat(mm) * pointRatio;
  },
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  divide(ary, n) {
    if (!Array.isArray(ary) || isNaN(n)) throw Error('Error: divide unexpected argument'); // eslint-disable-line 
    let idx = 0;
    const results = [];
    while (idx + n < ary.length) {
      const result = ary.slice(idx, idx + n);
      results.push(result);
      idx += n;
    }

    const rest = ary.slice(idx, ary.length + 1);
    results.push(rest);
    return results;
  },
  getNotEmptyRowData(sourceData, dataSchema) {
    return sourceData.filter(data => Object.keys(data)
      .some(key => (dataSchema ? dataSchema[key] !== data[key] : data[key])));
  },
  isEmpty(obj) {
    return !Object.keys(obj).length;
  },
};
