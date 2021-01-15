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
  const { colorPurple, colorTextPrimary } = theme;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.6667 28H25.3333V14.6666H28L16 2.66663L4 14.6666H6.66667V28H13.3333M18.6667 28V18.6666H13.3333V28M18.6667 28H13.3333"
        stroke={colorTextPrimary}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="14"
        y="19"
        width="4"
        height="8"
        fill={hasBodyColor ? colorPurple : colorTextPrimary}
      />
    </svg>
  );
};
