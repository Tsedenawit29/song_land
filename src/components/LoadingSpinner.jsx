/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

const LoadingSpinner = () => {
   return <div css={styles.spinner}>Loading...</div>;
};

const styles = {
  spinner: css`
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top: 3px solid #ff0066;
    width: 40px;
    height: 40px;
    animation: spin 0.8s linear infinite;
    margin: auto;

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `,
};

export default LoadingSpinner;
