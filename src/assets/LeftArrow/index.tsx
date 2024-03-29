export const LeftArrow = ({
  width = '20',
  height = '20',
}: {
  width?: string;
  height?: string;
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.33333 15.8334L2.5 10L8.33333 4.16669"
        stroke="#50586C"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 10H17.5"
        stroke="#50586C"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
