import React from 'react';
import { css } from '@emotion/react';
import './VideoPlayer.css'

export default function VideoPlayer({ source }) {
  const containerStyle = css`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  `;

  const svgStyle = css`
    width: 100%;
    height: 100%;
    padding: 5px; 
  `;

  const iframeStyle = css`
  frameBorder="0";
  border: '1px solid #fff';
  borderRadius: '5px';
  padding: '10px';
    width: 100%;
    height: 100%;
    border: none; 
  `;

  return (
    <div className="video-player-container" css={containerStyle}>
      <svg version="1.1" id="kinect-tv" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 71 897 493" css={svgStyle}>
        <g>
          <rect x="106" y="80" className="st0" width="689.4" height="400.9" />
          <path className="st0" d="M782.7,471H115.1V91.9h667.6v298.6V471z" />
        </g>
        <foreignObject x="106" y="80" width="689.4" height="400.9">
          <iframe 
          xmlns="http://www.w3.org/1999/xhtml"
           className="test-iframe"
            src={source}
             css={iframeStyle} 
             allow="autoplay"

             />
        </foreignObject>
        <rect x="373" y="480.9" className="st1" width="155" height="50.1" />
        <polyline className="st1" points="547.9,504 567,546 335,546 354.9,504 " />
        <polyline className="st1" points="373,504 354.9,504 335,546 567,546 547.9,504 528,504 " />
      </svg>
    </div>
  );
}
