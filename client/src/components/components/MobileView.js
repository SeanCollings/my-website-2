import React, { Component } from 'react';

class MobileView extends Component {
  state = { mobileWidth: false, openDrawer: false };

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions);
  }

  componentDidUpdate() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions = () => {
    if (window.innerWidth < 700) {
      this.setState({ mobileWidth: true });
    } else {
      this.setState({ mobileWidth: false });
    }
  };

  mobileWidth() {
    return this.state.mobileWidth;
  }

  consoleLog() {
    console.log('mobileWidth?', this.state.mobileWidth);
    console.log('this', this.props);
  }

  render() {
    return (
      <div>
        {this.props.children}
        {this.consoleLog()}
      </div>
    );
  }
}

export default MobileView;
