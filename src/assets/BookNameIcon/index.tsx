import theme from 'theme';
export const BookNameIcon = ({
  width = '16',
  height = '16',
}: {
  width?: string;
  height?: string;
}) => {
  const { colorTextPrimary } = theme;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 4.5C4 3.11929 5.11929 2 6.5 2H20V22H6.5C5.11929 22 4 20.8807 4 19.5V4.5Z"
        stroke={colorTextPrimary}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M4 19.5V19.5C4 18.1193 5.11928 17 6.49998 17H20"
        stroke={colorTextPrimary}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
};
