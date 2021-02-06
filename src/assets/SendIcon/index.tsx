export const SendIcon = ({
  width = '32',
  height = '32',
}: {
  width: string;
  height: string;
}) => {
  return (
    <svg
      className="icon line"
      width={width}
      height={height}
      id="send"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path
        d="M5.44,4.15l14.65,7a1,1,0,0,1,0,1.8l-14.65,7A1,1,0,0,1,4.1,18.54l2.72-6.13a1.06,1.06,0,0,0,0-.82L4.1,5.46A1,1,0,0,1,5.44,4.15Z"
        style={{
          fill: 'none',
          stroke: '#50586C',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '2px',
        }}
      ></path>
      <line
        x1="7"
        y1="12"
        x2="11"
        y2="12"
        style={{
          fill: 'none',
          stroke: '#50586C',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '2px',
        }}
      />
    </svg>
  );
};
