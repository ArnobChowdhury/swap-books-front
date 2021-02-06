import theme from 'theme';

export const DownArrow = ({
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
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 6L8 10L12 6"
        stroke={colorTextPrimary}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
