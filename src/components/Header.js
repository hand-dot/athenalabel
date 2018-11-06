import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Notifications from '@material-ui/icons/Notifications';
import Typography from '@material-ui/core/Typography';
import { TITLE, ACCOUNT_ID } from '../constants';
import util from '../utils';
import logo from '../image/logo.png';

const styles = {
  grow: {
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
  },
};

class Header extends Component {
  componentDidMount() {
    if (window.twttr) {
      window.twttr.widgets.load(this.twFollowButton);
    }
  }

  render() {
    const { classes, theme } = this.props;
    const isMobile = util.isMobile();
    return (
      <AppBar position="fixed" style={{ background: '#24292e' }}>
        <Toolbar>
          <div className={classes.grow}>
            <img src={logo} width={30} height={30} style={{ marginRight: theme.spacing.unit }} alt="logo" />
            <Typography variant={isMobile ? 'subtitle1' : 'headline' } color="inherit" style={{ marginRight: theme.spacing.unit, fontWeight : 600 }}>
              {TITLE}
            </Typography>
            <Typography style={{ display: isMobile ? 'none' : 'flex'}} variant="caption" color="inherit">
              無料ですぐに使える宛名ラベル作成サイト
            </Typography>
          </div>
          <a
            ref={(twFollowButton) => { this.twFollowButton = twFollowButton; }}
            href={`https://twitter.com/${ACCOUNT_ID}?ref_src=twsrc%5Etfw`}
            className="twitter-follow-button"
            data-show-count="false"
          >
            {`Follow @${ACCOUNT_ID}`}
          </a>
          <IconButton color="inherit">
            <Notifications fontSize="small" />
            <span style={{ position: 'absolute', left: 15, top: 15 }} id="changelog" />
          </IconButton>
        </Toolbar>
      </AppBar>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line
  theme: PropTypes.object.isRequired, // eslint-disable-line
};

export default withStyles(styles, { withTheme: true })(Header);
