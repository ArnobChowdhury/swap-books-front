import theme from 'theme';
export const Tick = ({ size = 24 }: { size?: number }): JSX.Element => {
  const { colorPrimary2 } = theme;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Iconly/Light/Tick Square">
        <g id="Tick Square">
          <path
            id="Stroke 1"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16.3344 2.75018H7.66537C4.64437 2.75018 2.75037 4.88918 2.75037 7.91618V16.0842C2.75037 19.1112 4.63537 21.2502 7.66537 21.2502H16.3334C19.3644 21.2502 21.2504 19.1112 21.2504 16.0842V7.91618C21.2504 4.88918 19.3644 2.75018 16.3344 2.75018Z"
            stroke={colorPrimary2}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            id="Stroke 3"
            d="M8.43982 12.0002L10.8138 14.3732L15.5598 9.6272"
            stroke={colorPrimary2}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </g>
    </svg>
  );
};
