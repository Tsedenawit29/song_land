import React from 'react';

const ErrorComponent = ({ message }) => {
  return (
    <div className="error-message">
      <p>{message}</p>
    </div>
  );
};

export default ErrorComponent;
