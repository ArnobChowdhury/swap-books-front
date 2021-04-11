import theme from 'theme';
export const AddBookIcon = ({
  width = '35',
  height = '35',
}: {
  width?: string;
  height?: string;
}) => {
  const { colorTextPrimary } = theme;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 35 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.5 30.625C24.7487 30.625 30.625 24.7487 30.625 17.5C30.625 10.2513 24.7487 4.375 17.5 4.375C10.2513 4.375 4.375 10.2513 4.375 17.5C4.375 24.7487 10.2513 30.625 17.5 30.625Z"
        stroke={colorTextPrimary}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23.6833 17.5H11.3167"
        stroke={colorTextPrimary}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5 11.3167V23.6833"
        stroke={colorTextPrimary}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
