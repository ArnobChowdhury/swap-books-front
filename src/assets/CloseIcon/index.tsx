import theme from 'theme';
export const CloseIcon = ({
  width = '24',
  height = '24',
  colorAlert,
}: {
  width?: string;
  height?: string;
  colorAlert?: boolean;
}) => {
  const { colorTextPrimary, colorAlert: colorRed } = theme;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 5L19 19M5 19L19 5"
        stroke={colorAlert ? colorRed : colorTextPrimary}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
};
