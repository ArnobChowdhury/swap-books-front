import React from 'react';
import theme from 'theme';

export const SwapIcon = ({ isSelected }: { isSelected?: boolean }) => {
  const { colorPrimary1, colorPrimary2, colorTextPrimary } = theme;
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.5547 28.6667H22.1133C26.14 28.6667 28.6667 25.8147 28.6667 21.7787V10.888C28.6667 6.852 26.1533 4 22.1133 4H10.5547C6.51467 4 4 6.852 4 10.888V21.7787C4 25.8147 6.51467 28.6667 10.5547 28.6667Z"
        fill={isSelected ? colorPrimary2 : 'transparent'}
        stroke={isSelected ? colorPrimary2 : colorTextPrimary}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21.0051 22.9431V11.595"
        stroke={isSelected ? colorPrimary1 : colorTextPrimary}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24.4031 19.5297L21.005 22.9436L17.6068 19.5297"
        stroke={isSelected ? colorPrimary1 : colorTextPrimary}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.7314 9.33374V20.6819"
        stroke={isSelected ? colorPrimary1 : colorTextPrimary}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.33334 12.7471L12.7315 9.33325L16.1296 12.7471"
        stroke={isSelected ? colorPrimary1 : colorTextPrimary}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
