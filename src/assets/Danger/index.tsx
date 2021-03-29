import theme from 'theme';
export const Danger = ({ size = 24 }: { size?: number }): JSX.Element => {
  const { colorPrimary2 } = theme;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Iconly/Light/Danger Circle">
        <g id="Danger Circle">
          <path
            id="Stroke 1"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.0001 2.75012C17.1081 2.75012 21.2501 6.89112 21.2501 12.0001C21.2501 17.1081 17.1081 21.2501 12.0001 21.2501C6.89112 21.2501 2.75012 17.1081 2.75012 12.0001C2.75012 6.89112 6.89112 2.75012 12.0001 2.75012Z"
            stroke={colorPrimary2}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            id="Stroke 3"
            d="M11.9952 8.20422V12.6232"
            stroke={colorPrimary2}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            id="Stroke 5"
            d="M11.995 15.7961H12.005"
            stroke={colorPrimary2}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </g>
    </svg>
  );
};
