import theme from 'theme';
export const BookAuthorIcon = ({
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
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.0259 14.8964L15.2849 4.63741C16.1348 3.78753 17.5128 3.78753 18.3626 4.63741C19.2125 5.4873 19.2125 6.86523 18.3626 7.71511L8.1036 17.9741L4 19L5.0259 14.8964Z"
        stroke={colorTextPrimary}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
