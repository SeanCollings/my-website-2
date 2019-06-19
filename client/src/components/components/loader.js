import React from 'react';
import Loader from 'react-loader-advanced';
import MiniLoader from 'react-loader-spinner';

const LoaderComponent = props => {
  const { showLoader, spinnerColor } = props;

  const spinner = (
    <span>
      <MiniLoader type="Oval" color={spinnerColor} height={45} width={45} />
    </span>
  );

  return (
    <Loader
      show={showLoader}
      message={spinner}
      backgroundStyle={{ backgroundColor: 'transparent' }}
    >
      {props.children}
    </Loader>
  );
};

export default LoaderComponent;
