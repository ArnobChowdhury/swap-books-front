import theme from 'theme';
export const HomeIcon = ({
  hasBodyColor = false,
  width = '32',
  height = '32',
}: {
  hasBodyColor?: boolean;
  width?: string;
  height?: string;
}) => {
  const { colorTextPrimary, colorWhite } = theme;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.3333 13.6666V27H15.6667V17.6666H10.3333V27H3.66667V13.6666H1L13 1.66663L25 13.6666H22.3333Z"
        fill={hasBodyColor ? colorTextPrimary : colorWhite}
        stroke={colorTextPrimary}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
