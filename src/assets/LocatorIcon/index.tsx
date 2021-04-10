import theme from 'theme';
export const LocatorIcon = ({
  width = '35',
  height = '35',
  isPrimaryColor = false,
}: {
  width?: string;
  height?: string;
  isPrimaryColor?: boolean;
}) => {
  const { colorPrimary2, colorWhite } = theme;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 35 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.58333 13.9583C6.58333 11.2509 7.65885 8.65439 9.57329 6.73995C11.4877 4.82552 14.0842 3.75 16.7917 3.75C19.4991 3.75 22.0956 4.82552 24.01 6.73995C25.9245 8.65439 27 11.2509 27 13.9583C27 22.7083 16.7917 30 16.7917 30C16.7917 30 6.58333 22.7083 6.58333 13.9583Z"
        stroke={isPrimaryColor ? colorPrimary2 : '#50586C'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="17"
        cy="13"
        r="4"
        fill={colorWhite}
        stroke={isPrimaryColor ? colorPrimary2 : '#50586C'}
        strokeWidth="2"
      />
    </svg>
  );
};
