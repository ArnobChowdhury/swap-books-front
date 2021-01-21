export const InterestIcon = () => {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="20" cy="20" r="20" fill="#A3DC29" />
      <g filter="url(#filter0_d)">
        <path
          d="M29.2938 12.7333C28.7688 12.2 28.1125 11.7333 27.3906 11.4667C26.6688 11.1333 25.8813 11 25.0938 11C24.3062 11 23.5188 11.2 22.7969 11.6C22.075 11.9333 21.4844 12.4667 20.8937 13.1333C20.7625 13.3333 20.6313 13.4667 20.5 13.6667C20.3687 13.4667 20.2375 13.2667 20.1063 13.1333C19.5813 12.5333 18.925 12 18.2031 11.6C17.4812 11.2667 16.6937 11 15.9062 11C15.1188 11 14.3313 11.2 13.6094 11.4667C12.8875 11.8 12.2969 12.2 11.7062 12.7333C11.1812 13.2667 10.7219 13.9333 10.4594 14.6667C10.1312 15.4 10 16.2 10 17C10 17.8 10.1969 18.6 10.4594 19.3333C10.7875 20.0667 11.1812 20.6667 11.7062 21.2667C12.2312 21.8 19.7781 28.7333 20.5 29C21.2219 28.6667 28.7031 21.8 29.2938 21.2667C29.8188 20.7333 30.2781 20.0667 30.5406 19.3333C30.8688 18.6 31 17.8 31 17C31 16.2 30.8031 15.4 30.5406 14.6667C30.2125 13.9333 29.8188 13.2667 29.2938 12.7333Z"
          fill="#FF4773"
        />
      </g>
      <defs>
        <filter
          id="filter0_d"
          x="0"
          y="5"
          width="41"
          height="38"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="5" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 0.278431 0 0 0 0 0.45098 0 0 0 0.3 0"
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
    </svg>
  );
};
