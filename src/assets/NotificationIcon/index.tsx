import theme from 'theme';
export const NotificationIcon = ({
  hasBodyColor = false,
  width = '32',
  height = '32',
}: {
  hasBodyColor?: boolean;
  width?: string;
  height?: string;
}) => {
  const { colorTextPrimary, colorPink, colorWhite } = theme;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 4C18.4753 4 20.8493 4.98333 22.5996 6.73367C24.35 8.48401 25.3333 10.858 25.3333 13.3333V24H6.66663V13.3333C6.66663 10.858 7.64996 8.48401 9.4003 6.73367C11.1506 4.98333 13.5246 4 16 4V4Z"
        stroke={colorTextPrimary}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 24H28H4ZM12 24C12 25.0609 12.4214 26.0783 13.1716 26.8284C13.9217 27.5786 14.9391 28 16 28C17.0609 28 18.0783 27.5786 18.8284 26.8284C19.5786 26.0783 20 25.0609 20 24"
        fill={hasBodyColor ? colorPink : colorWhite}
      />
      <path
        d="M12 24C12 25.0609 12.4214 26.0783 13.1716 26.8284C13.9217 27.5786 14.9391 28 16 28C17.0609 28 18.0783 27.5786 18.8284 26.8284C19.5786 26.0783 20 25.0609 20 24M4 24H28H4Z"
        stroke={colorTextPrimary}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
