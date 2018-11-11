import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Header from '../components/Header';
import TemplateEditor from '../components/TemplateEditor';
import LabelEditor from '../components/LabelEditor';
import Tutorial from '../components/Tutorial';
import util from '../utils';

const styles = {};
class App extends Component {
  constructor(props) {
    super(props);
    this.hotInstance = null;
    this.state = {
      isTemplateEditor: false, // テンプレート開発者用。現段階では非公開
    };
  }

  render() {
    const { theme } = this.props;
    const { isTemplateEditor } = this.state;
    return (
      <>
        <Header />
        <div style={{ height: theme.mixins.toolbar.minHeight }} />
        {(() => {
          const isMobile = util.isMobile();
          if (isTemplateEditor) {
            return <TemplateEditor />;
          } if (isMobile) {
            return <Tutorial />;
          }
          return <LabelEditor />;
        })()}

      </>
    );
  }
}

App.propTypes = {
  theme: PropTypes.object.isRequired, // eslint-disable-line
};

export default withStyles(styles, { withTheme: true })(App);
