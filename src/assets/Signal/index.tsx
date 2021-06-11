import React from 'react';
import theme from 'theme';

export const Signaal = ({ size = '64' }: { size?: string }) => {
  const { colorTextPrimary } = theme;
  return (
    <svg
      className="icon line"
      width={size}
      height={size}
      id="signal"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path
        d="M13,9.36a1,1,0,1,1-1-1A1,1,0,0,1,13,9.36ZM12,21V10.36"
        style={{
          fill: 'none',
          stroke: colorTextPrimary,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px',
        }}
      ></path>
      <path
        d="M15.54,5.83a5,5,0,0,1,0,7.07M8.46,5.83a5,5,0,0,0,0,7.07m9.9,2.83A9,9,0,0,0,18.36,3M5.64,3a9,9,0,0,0,0,12.73"
        style={{
          fill: 'none',
          stroke: colorTextPrimary,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '1.5px',
        }}
      ></path>
    </svg>
  );
};
