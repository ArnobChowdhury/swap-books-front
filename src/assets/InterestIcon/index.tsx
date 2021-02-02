export const InterestIcon = ({
  width = '30',
  height = '30',
  hasBodyColor = false,
}: {
  width: string;
  height: string;
  hasBodyColor: boolean;
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {!hasBodyColor && (
        <path
          d="M24.7081 6.8C25.8538 7.9503 26.4971 9.5077 26.4971 11.1312C26.4971 12.7548 25.8538 14.3122 24.7081 15.4625L15.2456 25L5.78306 15.4625C4.93211 14.6058 4.35277 13.5171 4.11757 12.3328C3.88236 11.1484 4.00173 9.921 4.46075 8.80416C4.91976 7.68732 5.69801 6.73069 6.69809 6.05402C7.69816 5.37735 8.87562 5.01071 10.0831 5C11.6976 5.0098 13.243 5.6567 14.3831 6.8C14.7156 7.12903 15.0053 7.4986 15.2456 7.9C15.4858 7.4986 15.7755 7.12903 16.1081 6.8C16.6698 6.23007 17.3392 5.77749 18.0774 5.46858C18.8156 5.15967 19.6078 5.00059 20.4081 5.00059C21.2083 5.00059 22.0005 5.15967 22.7387 5.46858C23.4769 5.77749 24.1463 6.23007 24.7081 6.8V6.8Z"
          fill="#FFF"
          stroke="#50586C"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {hasBodyColor && (
        <>
          <g filter="url(#filter0_d)">
            <path
              d="M24.7081 6.8C25.8538 7.9503 26.4971 9.5077 26.4971 11.1312C26.4971 12.7548 25.8538 14.3122 24.7081 15.4625L15.2456 25L5.78306 15.4625C4.93211 14.6058 4.35277 13.5171 4.11757 12.3328C3.88236 11.1484 4.00173 9.921 4.46075 8.80416C4.91976 7.68732 5.69801 6.73069 6.69809 6.05402C7.69816 5.37735 8.87562 5.01071 10.0831 5C11.6976 5.0098 13.243 5.6567 14.3831 6.8C14.7156 7.12903 15.0053 7.4986 15.2456 7.9C15.4858 7.4986 15.7755 7.12903 16.1081 6.8C16.6698 6.23007 17.3392 5.77749 18.0774 5.46858C18.8156 5.15967 19.6078 5.00059 20.4081 5.00059C21.2083 5.00059 22.0005 5.15967 22.7387 5.46858C23.4769 5.77749 24.1463 6.23007 24.7081 6.8V6.8Z"
              fill="#FF4773"
              stroke="#FF4773"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          <defs>
            <filter
              id="filter0_d"
              x="0"
              y="0"
              width="35.4909"
              height="31.5636"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              />
              <feOffset dy="2" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 1 0 0 0 0 0.278431 0 0 0 0 0.45098 0 0 0 0.5 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow"
                result="shape"
              />
            </filter>
          </defs>
        </>
      )}
    </svg>
  );
};
