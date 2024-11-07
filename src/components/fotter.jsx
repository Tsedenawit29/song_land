/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';

const Footer = () => {
  return (
    <footer css={styles.footer}>
      <div css={styles.footerContent}>
        <div css={styles.footerLinks}>
          <ul css={styles.linkList}>
            <li>
              <a href="/" css={styles.link}>Home</a>
            </li>
            <li>
              <a href="favorites" css={styles.link}>Favorites</a>
            </li>
            <li>
              <a href="library" css={styles.link}>Library</a>
            </li>
            <li>
              <a href="playlist" css={styles.link}>Playlist</a>
            </li>
          </ul>
        </div>
        <div css={styles.socialLinks}>
          <ul css={styles.socialList}>
            <li>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" css={styles.socialLink}>
                <i className="fab fa-facebook-f"></i>
              </a>
            </li>
            <li>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" css={styles.socialLink}>
                <i className="fab fa-twitter"></i>
              </a>
            </li>
            <li>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" css={styles.socialLink}>
                <i className="fab fa-instagram"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div css={styles.footerBottom}>
        <p css={styles.footerText}>© 2024 Music Website. All rights reserved.</p>
      </div>
    </footer>
  );
};

const styles = {
  footer: css`
    background-color: black;
    color: #fff;
    padding: 20px;
    text-align: center;
    font-size: 0.9rem;
    position: relative;
    bottom: 0;
    width: 100%;
  `,
  footerContent: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 10px;
    margin-left:40px;
  `,
  footerLinks: css`
    flex: 1;
    margin: 0 20px;
  `,
  linkList: css`
    list-style: none;
    padding: 0;
    margin: 0;
  `,
  link: css`
    color: pink;
    text-decoration: none;
    margin: 5px 0;
    display: block;
    transition: color 0.3s ease;
    &:hover {
      color:  #ff0066; /* Sidebar color on hover */
    }
  `,
  socialLinks: css`
    flex: 1;
    margin: 0 20px;
    text-align: right;
  `,
  socialList: css`
    list-style: none;
    padding: 0;
    margin-right: 40px;
    display: flex;
    justify-content: flex-end;
  `,
  socialLink: css`
    color: #fff;
    font-size: 1.5rem;
    margin-left: 15px;
    text-decoration: none;
    transition: color 0.3s ease;
    &:hover {
      color: #ff0066; /* Sidebar color on hover */
    }
  `,
  footerBottom: css`
    margin-top: 20px;
    padding-top: 10px;
    border-top: 1px solid #444;
  `,
  footerText: css`
    margin: 0;
    font-size: 0.8rem;
  `,
};

export default Footer;
