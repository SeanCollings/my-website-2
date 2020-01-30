import React from 'react';
import Loader from 'react-loader-advanced';
import MiniLoader from 'react-loader-spinner';

const LoaderComponent = props => {
  const { showLoader, spinnerColor, hideSpinner, small } = props;

  const spinner = (
    <span>
      <MiniLoader type="Oval" color={spinnerColor} height={45} width={45} />
    </span>
  );

  const spinnerSmall = (
    <span>
      <MiniLoader type="TailSpin" color="#FFC300" height={38} width={38} />
    </span>
  );

  return (
    <Loader
      show={showLoader}
      message={hideSpinner ? null : small ? spinnerSmall : spinner}
      backgroundStyle={{ backgroundColor: 'transparent' }}
    >
      {props.children}
    </Loader>
  );
};

export default LoaderComponent;
