export const PostOptionIcon = ({
  width = '30',
  height = '30',
}: {
  width?: string;
  height?: string;
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="8" y="14" width="3" height="3" fill="#8D8D8D" />
      <rect x="14" y="14" width="3" height="3" fill="#8D8D8D" />
      <rect x="20" y="14" width="3" height="3" fill="#8D8D8D" />
    </svg>
  );
};
