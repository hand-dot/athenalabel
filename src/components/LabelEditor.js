import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Handsontable from 'handsontable';
import Grid from '@material-ui/core/Grid';
import debounce from 'lodash.debounce';
import isEqual from 'lodash.isequal';
import 'handsontable/dist/handsontable.full.min.css';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import NativeSelect from '@material-ui/core/NativeSelect';
import Tooltip from '@material-ui/core/Tooltip';
import '../styles/handsontable-custom.css';
import '../styles/animation.css';
import templates from '../templates';
import util from '../utils';
import pdfUtil from '../utils/pdf';
import templateUtil from '../utils/template';
import Tutorial from './Tutorial';

const PDF_REFLESH_DEBOUNCE = 100;
const WINDOW_RESIZE_DEBOUNCE = 500;
const windowSeparatorRatio = window.innerWidth * 0.2;
const emptyIframe = URL.createObjectURL(
  new Blob(['<div>Loading...</div>'], { type: 'text/html' }),
);
const isIe = util.isIe();

const getTemplate = selectedTemplate => templateUtil.fmtTemplate(templates[selectedTemplate]);
const getData = (datas, template) => templateUtil.fmtData(datas, template);
const downloadPdf = (blob) => {
  if (!blob) return;
  if (window.navigator.msSaveBlob) {
    window.navigator.msSaveOrOpenBlob(blob, `${Date.now()}.pdf`);
  } else {
    window.open(window.URL.createObjectURL(blob));
  }
};

const getRowHeader = (index, labelLengthInPage) => {
  // eslint-disable-next-line radix
  const set = parseInt((index / labelLengthInPage));
  return `${set + 1}-${index + 1 - (labelLengthInPage * set)}`;
};

const styles = {
  flexItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  select: {
    minWidth: 200,
  },
};

const InnerHtml = props => (
  <div dangerouslySetInnerHTML={{ __html: props.html }} /> // eslint-disable-line
);

class LabelEditor extends Component {
  constructor(props) {
    super(props);
    this.refleshPdf = debounce(this.refleshPdf, PDF_REFLESH_DEBOUNCE);
    this.hotInstance = null;
    this.pdfBlob = null;
    this.state = {
      page: 1,
      selectedTemplate: '宛名8面',
      isOpenTutorial: false,
    };
  }

  componentDidMount() {
    const { selectedTemplate } = this.state;
    const template = getTemplate(selectedTemplate);
    if (!this.hotDom) return;
    const labelLengthInPage = templateUtil.getLabelLengthInPage(templates[selectedTemplate]);
    this.hotInstance = Handsontable(this.hotDom, {
      height:
        window.innerHeight
        - (this.hotDom ? this.hotDom.getBoundingClientRect().top : 0),
      width: window.innerWidth / 2 + windowSeparatorRatio - 1,
      rowHeaders: index => getRowHeader(index, labelLengthInPage),
      manualColumnMove: true,
      allowInsertRow: false,
      stretchH: 'all',
      colWidths: 140,
      columns: template.columns,
      dataSchema: template.dataSchema,
      afterChange: (changes) => {
        if (!changes) {
          this.refleshPdf();
          return;
        }
        const needReflech = changes.some((change) => {
          const [, , oldVal, newVal] = change;
          return oldVal !== newVal;
        });
        if (needReflech) this.refleshPdf();
      },
    });
    this.iframe.src = emptyIframe;
    this.loadSampleData();

    // ページを離れる時にデータが変更されていればページを離れないようにする処理
    window.onbeforeunload = (e) => {
      if (!this.hotInstance) return null;
      const datas = util.getNotEmptyRowData(this.hotInstance.getSourceData());
      const isSampleData = isEqual(
        datas,
        getTemplate(this.state.selectedTemplate).sampledata // eslint-disable-line
      );
      if (datas.length !== 0 && !isSampleData) {
        const dialogText = 'ページを離れてもよろしいですか？';
        e.returnValue = dialogText;
        return dialogText;
      }
      return null;
    };
    // リサイズされた時にhotの横幅を調整する
    window.onresize = debounce(() => {
      if (!this.iframe || !this.hotInstance) return;
      this.hotInstance.updateSettings({
        height:
          window.innerHeight
          - (this.hotDom ? this.hotDom.getBoundingClientRect().top : 0),
        width: window.innerWidth / 2 + windowSeparatorRatio - 1,
      });
      this.iframe.style.height = `${window.innerHeight
        - (this.iframe ? this.iframe.getBoundingClientRect().top + 5 : 0)}px`;
      this.iframe.style.width = `${window.innerWidth / 2
        - windowSeparatorRatio}px`;
    }, WINDOW_RESIZE_DEBOUNCE);
  }

  componentWillUnmount() {
    window.onbeforeunload = '';
    window.onresize = '';
  }

  handleChangeTemplate(e) {
    if (!this.hotInstance) return;
    const datas = util.getNotEmptyRowData(this.hotInstance.getSourceData());
    const { selectedTemplate } = this.state;
    const isSampleData = isEqual(
      datas,
      getTemplate(selectedTemplate).sampledata,
    );
    if (
      datas.length !== 0
      && !isSampleData
      && !window.confirm('データを変更されていますがテンプレートを変更しますか？')
    ) {
      return;
    }
    const template = getTemplate(e.target.value);
    const labelLengthInPage = templateUtil.getLabelLengthInPage(templates[e.target.value]);
    this.hotInstance.updateSettings({
      rowHeaders: index => getRowHeader(index, labelLengthInPage),
      columns: template.columns,
      dataSchema: template.dataSchema,
      data: [],
    });
    this.setState({ selectedTemplate: e.target.value, page: 1 }, () => {
      this.loadSampleData();
    });
  }

  handleChangePage(e) {
    const { selectedTemplate, page } = this.state;
    if (!this.hotInstance) return;
    const amount = templateUtil.getLabelLengthInPage(templates[selectedTemplate])
      * e.target.value;
    const rowCount = this.hotInstance.getSourceData().length;
    const isRemove = rowCount > amount;
    const arg = isRemove
      ? ['remove_row', amount, rowCount - amount]
      : ['insert_row', rowCount, amount - rowCount];
    const [, begin, end] = arg;
    if (isRemove) {
      const removeData = this.hotInstance
        .getSourceData()
        .slice(begin, begin + end);
      const removeDataHasInput = util.getNotEmptyRowData(removeData).length !== 0;
      if (
        removeDataHasInput
        && !window.confirm(
          `ページを${page}枚から${
            e.target.value
          }枚へ減らすと編集したデータが消えますがよろしいですか？`,
        )
      ) {
        return;
      }
    }
    this.hotInstance.alter(...arg);
    this.setState({ page: e.target.value });
    this.refleshPdf();
  }

  async refleshPdf() {
    this.pdfBlob = null;
    const { selectedTemplate } = this.state;
    const template = getTemplate(selectedTemplate);
    this.pdfBlob = await pdfUtil.getBlob(
      getData(this.hotInstance.getSourceData(), templates[selectedTemplate]),
      template.image,
      template.position,
    );
    this.iframe.src = URL.createObjectURL(this.pdfBlob);
  }

  loadSampleData() {
    const { selectedTemplate } = this.state;
    const sampledata = JSON.parse(
      JSON.stringify(getTemplate(selectedTemplate).sampledata),
    );
    this.hotInstance.loadData(sampledata);
    this.refleshPdf();
  }

  render() {
    const { classes } = this.props;
    const { isOpenTutorial, selectedTemplate, page } = this.state;
    return (
      <Grid container justify="space-between">
        <Grid item>
          <div
            className={classes.flexItem}
            style={{ padding: 5, justifyContent: 'space-around' }}
          >
            <Button
              variant="outlined"
              mini
              onClick={() => this.setState({ isOpenTutorial: true })}
            >
              使い方を見る
            </Button>
            <Dialog fullScreen open={isOpenTutorial}>
              <Tutorial
                handleClose={() => this.setState({ isOpenTutorial: false })}
              />
            </Dialog>
            <div className={classes.flexItem}>/</div>
            <div className={classes.flexItem}>
              <FormControl margin="none">
                <InputLabel htmlFor="select-template-helper">
                  テンプレート
                </InputLabel>
                <Select
                  value={selectedTemplate}
                  onChange={this.handleChangeTemplate.bind(this)}
                  classes={{ root: classes.select }}
                  inputProps={{
                    name: 'template',
                    id: 'select-template-helper',
                  }}
                >
                  {Object.keys(templates).map((templateKey) => {
                    const template = templates[templateKey];
                    return (
                      <MenuItem
                        key={template.name}
                        value={template.name}
                        classes={{ root: classes.menuItem }}
                      >
                        <Tooltip
                          interactive
                          title={<InnerHtml html={template.description} />}
                          placement="right"
                        >
                          <div style={{ width: '100%' }}>{template.name}</div>
                        </Tooltip>
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <Typography
                variant="subheading"
                className={classes.flexItem}
                style={{ margin: '0 20px' }}
              >
                x
              </Typography>
              <FormControl margin="none">
                <InputLabel htmlFor="select-page-helper">枚数</InputLabel>
                <NativeSelect
                  value={page}
                  onChange={this.handleChangePage.bind(this)}
                  input={<Input name="page" id="select-page-helper" />}
                >
                  {[...Array(10).keys()]
                    .map(i => i + 1)
                    .map(_ => (
                      <option key={_} value={_}>
                        {_}
                      </option>
                    ))}
                </NativeSelect>
              </FormControl>
              <Typography
                variant="subheading"
                className={classes.flexItem}
                style={{ marginLeft: 20 }}
              >
                =
                {' '}
                {templateUtil.getLabelLengthInPage(
                  templates[selectedTemplate],
                ) * page}
                セット
              </Typography>
            </div>
            <div className={classes.flexItem}>/</div>
            <Button
              variant="outlined"
              mini
              onClick={() => {
                downloadPdf(this.pdfBlob);
              }}
            >
              作成
            </Button>
          </div>
          <div
            ref={(node) => {
              this.hotDom = node;
            }}
          />
        </Grid>
        <Grid item>
          {isIe && (
            <div
              ref={(node) => {
                this.iframe = node;
              }}
              className={classes.flexItem}
              style={{
                position: 'fixed',
                right: 0,
                border: '1px solid #ccc',
                height:
                  window.innerHeight
                  - (this.iframe
                    ? this.iframe.getBoundingClientRect().top + 5
                    : 0),
                width: window.innerWidth / 2 - windowSeparatorRatio,
              }}
            >
              <Typography variant="caption" style={{ textAlign: 'center' }}>
                Internet Explorerでは
                <br />
                リアルタイムPDFプレビューがご利用いただけません。
                <br />
                「使い方を見る」から動作環境を確認してください。
              </Typography>
            </div>
          )}
          {!isIe && (
            <iframe
              style={{ position: 'fixed', right: 0, border: '1px solid #ccc' }}
              ref={(node) => {
                this.iframe = node;
              }}
              height={`${window.innerHeight
                - (this.iframe
                  ? this.iframe.getBoundingClientRect().top + 5
                  : 0)}px`}
              width={`${window.innerWidth / 2 - windowSeparatorRatio}px`}
              title="PDF"
            />
          )}
        </Grid>
      </Grid>
    );
  }
}

LabelEditor.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line
  theme: PropTypes.object.isRequired // eslint-disable-line
};

export default withStyles(styles, { withTheme: true })(LabelEditor);
