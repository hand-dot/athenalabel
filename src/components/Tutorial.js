import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Close from '@material-ui/icons/Close';
import { MOVIE_PROP, TITLE } from '../constants';
import util from '../utils';
import logo from '../image/logo.png';
import hotjar from '../image/hotjar.png';
import supportBrowser from '../image/support-browser.png';


const styles = {
  closeBtn: {
    marginLeft: 'auto',
    marginRight: 20,
  },
};

const Tutorial = (props) => {
  const { handleClose, classes, theme } = props;
  const isMobile = util.isMobile();
  return (
    <Grid container justify="space-between">
      {!isMobile && (
      <Grid item xs={12} style={{ display: 'flex' }}>
        <IconButton className={classes.closeBtn} onClick={handleClose}>
          <Close />
        </IconButton>
      </Grid>
      )}
      <Grid item xs={12}>
        <iframe
          style={{ display: 'block', margin: '0 auto' }}
          {...MOVIE_PROP}
          title="AthenaLabelの使い方"
          width={isMobile ? window.innerWidth : '960'}
          height={isMobile ? window.innerWidth * 0.56 : '540'}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant={isMobile ? 'caption' : 'subtitle1'} style={{ padding: theme.spacing.unit, textAlign: 'center' }}>
          {TITLE}
          は無料ですぐに使える宛名ラベル作成サイトです。
          <br />
          会員登録、データのアップロード必要なし!
          <br />
          Excelライクにブラウザでそのまま宛名ラベルを作成できます。
        </Typography>
        <Divider />
      </Grid>
      <Grid item xs={12} sm={3} style={{ padding: theme.spacing.unit }}>
        <Typography variant="subtitle1" gutterBottom>
          <span role="img" aria-label="使い方はとっても簡単">
              ✌
          </span>
              使い方はとっても簡単
        </Typography>
        <div style={{ marginBottom: theme.spacing.unit }}>
          <Typography variant="subtitle2">
                1.テンプレート・印刷枚数を選択!
          </Typography>
          <Typography style={{ paddingLeft: theme.spacing.unit }} variant="caption">
                ご利用用途に合わせてテンプレートを選択してください。
            <br />
                テンプレートはこれからも随時追加予定です！
          </Typography>
        </div>
        <div style={{ marginBottom: theme.spacing.unit }}>
          <Typography variant="subtitle2">
                2.データを入力!
          </Typography>
          <Typography style={{ paddingLeft: theme.spacing.unit }} variant="caption">
                エクセルと同等の操作やショートカット利用可能で、
            <br />
                エクセルからもしくはエクセルへのコピペにも対応しています。
          </Typography>
        </div>
        <div style={{ marginBottom: theme.spacing.unit }}>
          <Typography variant="subtitle2">
                3.PDFをダウンロードして印刷!
          </Typography>
          <Typography style={{ paddingLeft: theme.spacing.unit }} variant="caption">
                PDFをダウンロードし、
            <br />
                原寸(100%)で印刷してください!
          </Typography>
        </div>
      </Grid>
      <Hidden xsUp>
        <Grid item xs={12}>
          <Divider />
        </Grid>
      </Hidden>
      <Grid item xs={12} sm={3} style={{ padding: theme.spacing.unit }}>
        <Typography variant="subtitle1" gutterBottom>
          <span role="img" aria-label="ポリシー">
              👍
          </span>
              安心して利用できます
        </Typography>
        <div style={{ marginBottom: theme.spacing.unit }}>
          <Typography variant="subtitle2">
                ・セキュリティー
          </Typography>
          <Typography style={{ paddingLeft: theme.spacing.unit }} variant="caption">
                入力情報をサーバーに送信していません。
            <br />
                ブラウザだけで動作するので個人情報は外部に漏れません。
          </Typography>
        </div>
        <div style={{ marginBottom: theme.spacing.unit }}>
          <Typography variant="subtitle2">
                ・無料
          </Typography>
          <Typography style={{ paddingLeft: theme.spacing.unit }} variant="caption">
                開発者がプライベートで使っているものを公開しています。
            <br />
                なので基本的な利用で有料にする予定はありません。
          </Typography>
        </div>
      </Grid>
      <Hidden xsDown>
        <Grid item xs={12} sm={3} style={{ padding: theme.spacing.unit }}>
          <Typography variant="subtitle1" gutterBottom>
            <span role="img" aria-label="ポリシー">
              👋
            </span>
              Tips
          </Typography>
          <div style={{ marginBottom: theme.spacing.unit }}>
            <Typography variant="subtitle2">
                ・改行
            </Typography>
            <Typography style={{ paddingLeft: theme.spacing.unit }} variant="caption">
                入力した文字がはみ出してしまうときは
              <br />
                Excelと同じようにAltを押しながらEnterを押すと改行できます。
            </Typography>
          </div>
          <div style={{ marginBottom: theme.spacing.unit }}>
            <Typography variant="subtitle2">
                ・列の並び替え
            </Typography>
            <Typography style={{ paddingLeft: theme.spacing.unit }} variant="caption">
                ドラッグ&amp;ドロップで列を並び替えることができます。
              <br />
                CSVなどから一気に貼り付ける際に、
              <br />
                列を並び替えてからやって見てください。
            </Typography>
          </div>
        </Grid>
      </Hidden>
      <Hidden xsDown>
        <Grid item xs={12} sm={3} style={{ padding: theme.spacing.unit }}>
          <Typography variant="subtitle1" gutterBottom>
            <span role="img" aria-label="ポリシー">
              🙏
            </span>
              お願い
          </Typography>
          <div style={{ marginBottom: theme.spacing.unit }}>
            <Typography variant="subtitle2">
                ・フィードバックしてください!
            </Typography>
            <Typography style={{ paddingLeft: theme.spacing.unit }} variant="caption">
                一人で開発しています。
              <br />
                もし不具合,改善点を発見したらフィードバックしてください。
              <br />
                また、欲しいテンプレートなども教えてください。
              <br />
                右のこいつ
              <img src={hotjar} alt="hotjar" width={20} height={20} />
                が目印です
            </Typography>
          </div>
          <div style={{ marginBottom: theme.spacing.unit }}>
            <Typography variant="subtitle2">
                ・お友達に紹介してください!
            </Typography>
            <Typography style={{ paddingLeft: theme.spacing.unit }} variant="caption">
                いろんな人に使ってもらうこと、
              <br />
                フィードバックや励ましの言葉がサービス維持の原動力です！
              <br />
                是非いろんな人に紹介してください！
            </Typography>
          </div>
        </Grid>
      </Hidden>
      <Hidden xsDown>
        <Grid item xs={12}>
          <Divider />
        </Grid>
      </Hidden>
      <Hidden xsDown>
        <Grid item xs={12} style={{ padding: theme.spacing.unit, textAlign: 'center' }}>
          <Typography variant="subtitle1" gutterBottom>
            <span role="img" aria-label="ポリシー">
            ✅
            </span>
            動作環境
          </Typography>
          <img src={supportBrowser} alt="supportBrowser" width="300" />
          <Typography style={{ paddingLeft: theme.spacing.unit }} variant="caption">
            *Google Chrome推奨
            <br />
            *Internet ExplorerではリアルタイムPDFプレビューがご利用いただけません。
          </Typography>
        </Grid>
      </Hidden>
      <Grid
        item
        xs={12}
        style={{
          paddingBottom: '1rem',
          paddingTop: '1rem',
          textAlign: 'center',
          background: '#272d33',
          color: '#fff',
        }}
      >
        <Typography gutterBottom variant="caption" color="inherit" style={{ display: 'flex', justifyContent: 'center', paddingTop: '1rem' }}>
          本サービスはスマートフォンでは利用できません。
          <br />
          利用するためにはPCで再度アクセスしてください。
        </Typography>
        <Typography gutterBottom variant="caption" color="inherit" style={{ display: 'flex', justifyContent: 'center' }}>
            Copyright (c)
          {' '}
          {TITLE}
          {' '}
            All Rights Reserved.
        </Typography>
        <img src={logo} width={30} height={30} style={{ animation: 'good 1s linear 0s infinite' }} alt="logo" />
      </Grid>
    </Grid>
  );
};

Tutorial.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line
  theme: PropTypes.object.isRequired, // eslint-disable-line
};

export default withStyles(styles, { withTheme: true })(Tutorial);
