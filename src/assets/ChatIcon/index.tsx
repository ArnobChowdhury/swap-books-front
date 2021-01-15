import theme from 'theme';
export const ChatIcon = ({
  width = '32',
  height = '32',
  hasBodyColor,
}: {
  width?: string;
  height?: string;
  hasBodyColor?: boolean;
}) => {
  const { colorPurple, colorGreen, colorPink, colorTextPrimary } = theme;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M27.6572 5.33333V21.3333C27.6572 21.687 27.5167 22.0261 27.2666 22.2761C27.0166 22.5262 26.6775 22.6667 26.3238 22.6667H16.9905L10.3238 28V22.6667H4.9905C4.63688 22.6667 4.29774 22.5262 4.04769 22.2761C3.79764 22.0261 3.65717 21.687 3.65717 21.3333V5.33333C3.65717 4.97971 3.79764 4.64057 4.04769 4.39052C4.29774 4.14048 4.63688 4 4.9905 4H26.3238C26.6775 4 27.0166 4.14048 27.2666 4.39052C27.5167 4.64057 27.6572 4.97971 27.6572 5.33333Z"
        stroke={colorTextPrimary}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="9"
        y="12"
        width="3"
        height="3"
        fill={hasBodyColor ? colorPurple : colorTextPrimary}
      />
      <rect
        x="14.4857"
        y="12"
        width="3"
        height="3"
        fill={hasBodyColor ? colorGreen : colorTextPrimary}
      />
      <rect
        x="19.9714"
        y="12"
        width="3"
        height="3"
        fill={hasBodyColor ? colorPink : colorTextPrimary}
      />
    </svg>
  );
};
