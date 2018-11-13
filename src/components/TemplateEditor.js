import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import debounce from 'lodash.debounce';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';
import TextField from '@material-ui/core/TextField';
import '../styles/handsontable-custom.css';
import pdfUtil from '../utils/pdf';
import util from '../utils';

// このコンポーネントはテンプレート開発者用。公開していません。
const PDF_REFLESH_MS = 10;
const windowSeparatorRatio = window.innerWidth * 0.2;
const template = {};

const hotColumns = [
  { data: 'Column', title: 'Column' },
  {
    data: 'x(mm)',
    title: 'x(mm)',
    width: 80,
    type: 'numeric',
  },
  {
    data: 'y(mm)',
    title: 'y(mm)',
    width: 80,
    type: 'numeric',
  },
  {
    data: 'width(mm)',
    title: 'width(mm)',
    width: 80,
    type: 'numeric',
  },
  {
    data: 'alignment',
    title: 'alignment',
    width: 80,
    type: 'dropdown',
    source: ['left', 'center', 'right'],
  },
  {
    data: 'size(pt)',
    title: 'size(pt)',
    width: 80,
    type: 'numeric',
  },
  {
    data: 'space(pt)',
    title: 'space(pt)',
    width: 80,
    type: 'numeric',
  },
  {
    data: 'line-height(em)',
    title: 'line-height(em)',
    width: 120,
    type: 'numeric',
  },
  { data: 'SampleData', title: 'SampleData' },
];

const dataSchema = {
  Column: '',
  'x(mm)': 0,
  'y(mm)': 0,
  'width(mm)': 0,
  alignment: 'left',
  'size(pt)': 18,
  'space(pt)': 0,
  'line-height(em)': 1,
  SampleData: '',
};

const downloadTemplate = (templateName, templateDescription) => {
  if (util.isEmpty(template)) {
    alert('テンプレートを編集してください。');
    return;
  }
  template.name = templateName;
  template.description = templateDescription;
  const blob = new Blob([JSON.stringify(template)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${templateName || 'notitle'}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

const setIframe = async (pdfData, base64, positionData) => {
  const blob = await pdfUtil.getBlob(pdfData, base64, positionData);
  document.getElementById('pdfIframe').src = URL.createObjectURL(blob);
};

const setTemplate = (pdfData, image, positionData) => {
  template.sampledata = pdfData;
  template.position = positionData;
  template.image = image;
  template.columns = Object.keys(pdfData[0]).map(key => ({
    data: key,
    title: key,
  }));
  template.dataSchema = Object.keys(pdfData[0]).reduce((obj, key) => {
    obj[key] = null; // eslint-disable-line
    return obj;
  }, {});
};

const formatTemplate2State = ({
  description,
  image,
  columns,
  sampledata,
  position,
}) => {
  const datas = [];
  columns.forEach((column) => {
    const key = column.data;
    const data = {
      Column: key,
      'x(mm)': position[key].position.x,
      'y(mm)': position[key].position.y,
      'width(mm)': position[key].width,
      alignment: position[key].alignment,
      'size(pt)': position[key].size,
      'space(pt)': position[key].space,
      'line-height(em)': position[key].lineHeight,
      SampleData: sampledata[0][key],
    };
    datas.push(data);
  });
  return { description, image: image || null, datas };
};

const refleshPdf = debounce((datas, image) => {
  const pdfData = [{}];
  const positionData = {};
  datas.forEach((data) => {
    pdfData[0][data.Column] = data.SampleData;
    positionData[data.Column] = {
      position: { x: +data['x(mm)'], y: +data['y(mm)'] },
      width: +data['width(mm)'],
      alignment: data.alignment,
      size: +data['size(pt)'],
      space: +data['space(pt)'],
      lineHeight: +data['line-height(em)'],
    };
  });
  setTemplate(pdfData, image, positionData);
  setIframe(pdfData, image, positionData);
}, PDF_REFLESH_MS);

class TemplateEditor extends Component {
  constructor(props) {
    super(props);
    this.hotInstance = null;
    this.state = {
      templateName: '',
      templateDescription: '',
      image: null,
    };
  }

  componentDidMount() {
    if (!this.hotDom) return;
    this.hotInstance = Handsontable(this.hotDom, {
      height:
        window.innerHeight
        - (this.hotDom ? this.hotDom.getBoundingClientRect().top : 0),
      width: window.innerWidth / 2 + windowSeparatorRatio - 1,
      rowHeaders: true,
      contextMenu: true,
      minRows: 200,
      colWidths:
        (window.innerWidth / 2
          + windowSeparatorRatio
          - hotColumns.reduce((num, column) => {
            num += column.width || 0; // eslint-disable-line
            return num;
          }, 0))
          / 2
        - 35,
      columns: hotColumns,
      dataSchema,
      afterChange: debounce((changes) => {
        if (!changes) return;
        const needReflech = changes.some((change) => {
          const [, , oldVal, newVal] = change;
          return oldVal !== newVal;
        });
        if (needReflech) {
          const { image } = this.state;
          refleshPdf(
            util.getNotEmptyRowData(
              this.hotInstance.getSourceData(),
              dataSchema,
            ),
            image,
          );
        }
      }, PDF_REFLESH_MS),
    });
    const blob = new Blob(['<div>左のテンプレートを編集して下さい。</div>'], {
      type: 'text/html',
    });
    this.iframe.src = URL.createObjectURL(blob);
  }

  handleChangeTemplateName(e) {
    this.setState({ templateName: e.target.value });
  }

  handleChangeTemplateDescription(e) {
    this.setState({ templateDescription: e.target.value });
  }

  handleChangeImage(event) {
    const files = event.target.files; // eslint-disable-line
    const fileReader = new FileReader();
    fileReader.addEventListener('load', (e) => {
      this.setState({ image: e.target.result });
      if (this.hotInstance) {
        refleshPdf(
          util.getNotEmptyRowData(this.hotInstance.getSourceData(), dataSchema),
          e.target.result,
        );
      }
    });
    fileReader.readAsDataURL(files[0]);
  }

  removeImage() {
    this.imageInput.value = '';
    this.setState({ image: null });
    if (this.hotInstance) {
      refleshPdf(util.getNotEmptyRowData(this.hotInstance.getSourceData(), dataSchema), null);
    }
  }

  handleChangeTemplate(event) {
    const files = event.target.files; // eslint-disable-line
    const fileReader = new FileReader();
    fileReader.addEventListener('load', (e) => {
      const { description, image, datas } = formatTemplate2State(
        JSON.parse(e.target.result),
      );
      if (this.hotInstance) {
        this.hotInstance.updateSettings({
          data: JSON.parse(JSON.stringify(datas)),
        });
      }
      this.setState({
        templateName: files[0].name.replace('.json', ''),
        templateDescription: description,
        image,
      });
      refleshPdf(datas, image);
    });
    if (files[0]) {
      fileReader.readAsText(files[0]);
    }
  }

  render() {
    const { templateName, templateDescription } = this.state;
    return (
      <Grid container justify="space-between">
        <Grid item>
          <TextField
            style={{ margin: '10px 10px 10px 0' }}
            label="templateName"
            value={templateName}
            onChange={this.handleChangeTemplateName.bind(this)}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
          />
          <TextField
            fullWidth
            style={{ margin: '10px 10px 10px 0' }}
            label="templateDescription"
            value={templateDescription}
            onChange={this.handleChangeTemplateDescription.bind(this)}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
          />
          <div
            style={{
              padding: 10,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'bottom',
            }}
          >
            <label htmlFor="image">
              Image:
              <input
                id="image"
                type="file"
                accept="image/*"
                ref={(node) => { this.imageInput = node; }}
                onChange={this.handleChangeImage.bind(this)}
              />
            </label>
            <button
              type="button"
              onClick={this.removeImage.bind(this)}
            >
              x
            </button>
            <div>/</div>
            <label htmlFor="importTemplate">
              Load:
              <input
                id="importTemplate"
                type="file"
                accept="application/json"
                onChange={this.handleChangeTemplate.bind(this)}
              />
            </label>
            <div>/</div>
            <button
              type="button"
              onClick={() => { downloadTemplate(templateName, templateDescription); }}
            >
              Download
            </button>
          </div>
          <div ref={(node) => { this.hotDom = node; }} />
        </Grid>
        <Grid item>
          <iframe
            style={{ position: 'fixed', right: 0, border: '1px solid #ccc' }}
            ref={(node) => { this.iframe = node; }}
            height={`${window.innerHeight
              - (this.iframe
                ? this.iframe.getBoundingClientRect().top + 5
                : 0)}px`}
            width={`${window.innerWidth / 2 - windowSeparatorRatio}px`}
            id="pdfIframe"
            title="PDF"
          />
        </Grid>
      </Grid>
    );
  }
}

export default TemplateEditor;
