import util from './index';

const dummyImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYII=';

window.onload = () => {
  window.pdfMake.fonts = {
    NotoSansCJKjp: {
      normal: 'NotoSansCJKjp-Regular.ttf',
    },
  };
};

export default {
  async getBlob(datas, image, positionData) {
    // fontの読み込みが終わるまで待つ
    if (!window.pdfMake || !window.pdfMake.fonts) {
      await util.sleep(1000);
      return this.getBlob(datas, image, positionData);
    }
    const docDefinition = {
      pageSize: 'A4',
      defaultStyle: { font: 'NotoSansCJKjp' },
      content: [],
    };
    if (!Array.isArray(datas) || datas.length === 0) {
      docDefinition.content.push({
        image: image || dummyImage,
        absolutePosition: { x: 0, y: 0 },
        width: 595,
      });
    } else {
      datas.forEach((data, index) => {
        docDefinition.content.push({
          image: image || dummyImage,
          absolutePosition: { x: 0, y: 0 },
          width: 595,
          pageBreak: index === 0 ? '' : 'before',
        });
        Object.keys(positionData).forEach((key) => {
          const labelData = positionData[key];
          const textObj = {
            absolutePosition: {
              x: util.mm2pt(labelData.position.x),
              y: util.mm2pt(labelData.position.y),
            },
            alignment: labelData.alignment,
            columns: [{
              text: util.zenkaku2hankaku(data[key]),
              width: util.mm2pt(labelData.width),
              fontSize: labelData.size,
              characterSpacing: labelData.space,
              lineHeight: labelData.lineHeight,
            }],
          };
          docDefinition.content.push(textObj);
        });
      });
    }
    const pdf = window.pdfMake.createPdf(docDefinition);
    return new Promise(resolve => pdf.getBlob(blob => resolve(blob)));
  },
};
