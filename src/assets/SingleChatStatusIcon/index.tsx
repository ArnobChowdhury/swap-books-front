import theme from 'theme';
export const SingleChatStatusIcon = ({
  width = '16',
  height = '16',
  status,
}: {
  width?: string;
  height?: string;
  status: 'sending' | 'registered' | 'seen';
}) => {
  const { colorWhite, colorTextPrimary } = theme;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
        fill={status === 'seen' ? colorTextPrimary : colorWhite}
        stroke={colorTextPrimary}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.33331 7.99996L7.33331 9.99996L10.6666 6.66663"
        stroke={
          status === 'seen' || status === 'sending' ? colorWhite : colorTextPrimary
        }
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
