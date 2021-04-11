import theme from 'theme';
interface LogoProps {
  width?: number;
  lightBG?: boolean;
}
export const Logo: React.FC<LogoProps> = ({
  width = 200,
  lightBG = false,
}: LogoProps): JSX.Element => {
  const { colorTextSecondary } = theme;
  return (
    <>
      {!lightBG && (
        <svg
          width={width}
          height="35"
          viewBox="0 0 240 51"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 51C0.89543 51 0 50.1046 0 49L0 26H45V49C45 50.1046 44.1046 51 43 51H2Z"
            fill="#CDC8FF"
          />
          <path
            d="M0 25L0 2C0 0.89543 0.895431 0 2 0H43C44.1046 0 45 0.89543 45 2V25H0Z"
            fill="#A091FF"
          />
          <path
            d="M10.8555 43C10.5221 43 10.2221 42.8833 9.95547 42.65C9.72214 42.3833 9.60547 42.0833 9.60547 41.75V9.25C9.60547 8.88333 9.72214 8.58333 9.95547 8.35C10.2221 8.11667 10.5221 8 10.8555 8H24.8555C29.1221 8 32.4721 8.98333 34.9055 10.95C37.3721 12.9167 38.6055 15.7833 38.6055 19.55C38.6055 23.2833 37.3888 26.1 34.9555 28C32.5221 29.8667 29.1555 30.8 24.8555 30.8H18.9055V41.75C18.9055 42.1167 18.7721 42.4167 18.5055 42.65C18.2721 42.8833 17.9721 43 17.6055 43H10.8555ZM24.6055 23.9C26.0721 23.9 27.2221 23.5333 28.0555 22.8C28.8888 22.0333 29.3055 20.9167 29.3055 19.45C29.3055 18.0833 28.9055 17 28.1055 16.2C27.3388 15.3667 26.1721 14.95 24.6055 14.95H18.7555V23.9H24.6055Z"
            fill="#140564"
          />
          <path
            d="M60.5002 43.5C57.5669 43.5 55.2002 42.5167 53.4002 40.55C51.6002 38.55 50.7002 35.7667 50.7002 32.2V18.25C50.7002 17.8833 50.8169 17.5833 51.0502 17.35C51.2835 17.1167 51.5835 17 51.9502 17H58.2002C58.5669 17 58.8669 17.1167 59.1002 17.35C59.3669 17.5833 59.5002 17.8833 59.5002 18.25V31.9C59.5002 35.1667 60.9502 36.8 63.8502 36.8C65.2502 36.8 66.3502 36.3667 67.1502 35.5C67.9502 34.6333 68.3502 33.4333 68.3502 31.9V18.25C68.3502 17.8833 68.4669 17.5833 68.7002 17.35C68.9669 17.1167 69.2669 17 69.6002 17H75.8502C76.2169 17 76.5169 17.1167 76.7502 17.35C76.9835 17.5833 77.1002 17.8833 77.1002 18.25V41.75C77.1002 42.0833 76.9835 42.3833 76.7502 42.65C76.5169 42.8833 76.2169 43 75.8502 43H70.0502C69.7169 43 69.4169 42.8833 69.1502 42.65C68.9169 42.3833 68.8002 42.0833 68.8002 41.75V39.85C67.0669 42.2833 64.3002 43.5 60.5002 43.5Z"
            fill="white"
          />
          <path
            d="M94.6814 43.5C91.9814 43.5 89.7148 43.1167 87.8814 42.35C86.0814 41.5833 84.7481 40.6667 83.8814 39.6C83.0148 38.5333 82.5814 37.5833 82.5814 36.75C82.5814 36.4167 82.6981 36.15 82.9314 35.95C83.1981 35.7167 83.4814 35.6 83.7814 35.6H89.4814C89.6814 35.6 89.8648 35.6833 90.0314 35.85C90.4314 36.1167 90.7314 36.3333 90.9314 36.5C91.6648 37.0333 92.2981 37.4333 92.8314 37.7C93.3981 37.9333 94.0814 38.05 94.8814 38.05C95.8481 38.05 96.6314 37.8667 97.2314 37.5C97.8648 37.1 98.1814 36.55 98.1814 35.85C98.1814 35.2833 98.0148 34.8333 97.6814 34.5C97.3814 34.1667 96.7814 33.85 95.8814 33.55C94.9814 33.2167 93.6148 32.8667 91.7814 32.5C89.0148 31.9333 86.8814 31.0167 85.3814 29.75C83.9148 28.45 83.1814 26.7167 83.1814 24.55C83.1814 23.1833 83.6148 21.8833 84.4814 20.65C85.3481 19.4167 86.6314 18.4167 88.3314 17.65C90.0648 16.8833 92.1148 16.5 94.4814 16.5C96.8481 16.5 98.9148 16.8667 100.681 17.6C102.448 18.3333 103.781 19.2333 104.681 20.3C105.615 21.3333 106.081 22.2833 106.081 23.15C106.081 23.45 105.965 23.7167 105.731 23.95C105.531 24.1833 105.281 24.3 104.981 24.3H99.7814C99.5148 24.3 99.2648 24.2167 99.0314 24.05C98.5981 23.8167 98.2148 23.5667 97.8814 23.3C97.3148 22.8667 96.7814 22.5333 96.2814 22.3C95.7814 22.0667 95.1648 21.95 94.4314 21.95C93.5648 21.95 92.8648 22.15 92.3314 22.55C91.8314 22.95 91.5814 23.4667 91.5814 24.1C91.5814 24.6 91.7148 25.0167 91.9814 25.35C92.2814 25.6833 92.8814 26.0167 93.7814 26.35C94.7148 26.65 96.0814 26.9667 97.8814 27.3C101.115 27.8667 103.465 28.8667 104.931 30.3C106.431 31.7333 107.181 33.4167 107.181 35.35C107.181 37.8167 106.081 39.8 103.881 41.3C101.681 42.7667 98.6148 43.5 94.6814 43.5Z"
            fill="white"
          />
          <path
            d="M125.772 43C118.872 43 115.422 39.7167 115.422 33.15V23.55H111.522C111.155 23.55 110.838 23.4333 110.572 23.2C110.338 22.9667 110.222 22.6667 110.222 22.3V18.25C110.222 17.8833 110.338 17.5833 110.572 17.35C110.838 17.1167 111.155 17 111.522 17H115.422V8.75C115.422 8.38333 115.538 8.08333 115.772 7.85C116.038 7.61667 116.338 7.5 116.672 7.5H122.472C122.838 7.5 123.138 7.61667 123.372 7.85C123.605 8.08333 123.722 8.38333 123.722 8.75V17H129.972C130.338 17 130.638 17.1167 130.872 17.35C131.138 17.5833 131.272 17.8833 131.272 18.25V22.3C131.272 22.6667 131.138 22.9667 130.872 23.2C130.638 23.4333 130.338 23.55 129.972 23.55H123.722V32.45C123.722 34.9167 124.672 36.15 126.572 36.15H130.422C130.788 36.15 131.088 36.2667 131.322 36.5C131.555 36.7333 131.672 37.0333 131.672 37.4V41.75C131.672 42.0833 131.555 42.3833 131.322 42.65C131.088 42.8833 130.788 43 130.422 43H125.772Z"
            fill="white"
          />
          <path
            d="M149.112 43.5C144.978 43.5 141.795 42.5167 139.562 40.55C137.328 38.5833 136.112 35.8167 135.912 32.25C135.878 31.8167 135.862 31.0667 135.862 30C135.862 28.9333 135.878 28.1833 135.912 27.75C136.112 24.2167 137.362 21.4667 139.662 19.5C141.962 17.5 145.112 16.5 149.112 16.5C153.145 16.5 156.312 17.5 158.612 19.5C160.912 21.4667 162.162 24.2167 162.362 27.75C162.395 28.1833 162.412 28.9333 162.412 30C162.412 31.0667 162.395 31.8167 162.362 32.25C162.162 35.8167 160.945 38.5833 158.712 40.55C156.478 42.5167 153.278 43.5 149.112 43.5ZM149.112 37.4C150.578 37.4 151.662 36.9667 152.362 36.1C153.062 35.2 153.462 33.8333 153.562 32C153.595 31.6667 153.612 31 153.612 30C153.612 29 153.595 28.3333 153.562 28C153.462 26.2 153.045 24.85 152.312 23.95C151.612 23.05 150.545 22.6 149.112 22.6C146.345 22.6 144.878 24.4 144.712 28L144.662 30L144.712 32C144.778 33.8333 145.162 35.2 145.862 36.1C146.595 36.9667 147.678 37.4 149.112 37.4Z"
            fill="white"
          />
          <path
            d="M169.628 43C169.295 43 168.995 42.8833 168.728 42.65C168.495 42.3833 168.378 42.0833 168.378 41.75V8.75C168.378 8.38333 168.495 8.08333 168.728 7.85C168.995 7.61667 169.295 7.5 169.628 7.5H175.428C175.795 7.5 176.095 7.61667 176.328 7.85C176.561 8.08333 176.678 8.38333 176.678 8.75V25.5L183.628 17.85C183.695 17.7833 183.811 17.6667 183.978 17.5C184.178 17.3333 184.378 17.2167 184.578 17.15C184.778 17.05 185.011 17 185.278 17H191.978C192.278 17 192.528 17.1167 192.728 17.35C192.961 17.55 193.078 17.8 193.078 18.1C193.078 18.4667 192.945 18.75 192.678 18.95L183.678 28.65L193.928 41.1C194.195 41.3667 194.328 41.6167 194.328 41.85C194.328 42.1833 194.211 42.4667 193.978 42.7C193.778 42.9 193.511 43 193.178 43H186.328C185.895 43 185.561 42.9333 185.328 42.8C185.128 42.6667 184.878 42.45 184.578 42.15L176.678 32.65V41.75C176.678 42.0833 176.561 42.3833 176.328 42.65C176.095 42.8833 175.795 43 175.428 43H169.628Z"
            fill="white"
          />
          <path
            d="M199.826 13.25C199.459 13.25 199.159 13.1333 198.926 12.9C198.693 12.6667 198.576 12.3667 198.576 12V7.5C198.576 7.13333 198.693 6.83333 198.926 6.6C199.159 6.36667 199.459 6.25 199.826 6.25H205.826C206.193 6.25 206.493 6.36667 206.726 6.6C206.959 6.83333 207.076 7.13333 207.076 7.5V12C207.076 12.3667 206.959 12.6667 206.726 12.9C206.493 13.1333 206.193 13.25 205.826 13.25H199.826ZM199.876 43C199.509 43 199.209 42.8833 198.976 42.65C198.743 42.4167 198.626 42.1167 198.626 41.75V18.25C198.626 17.8833 198.743 17.5833 198.976 17.35C199.209 17.1167 199.509 17 199.876 17H205.776C206.143 17 206.443 17.1167 206.676 17.35C206.909 17.5833 207.026 17.8833 207.026 18.25V41.75C207.026 42.0833 206.909 42.3833 206.676 42.65C206.443 42.8833 206.143 43 205.776 43H199.876Z"
            fill="white"
          />
          <path
            d="M226.233 43.5C222.099 43.5 218.916 42.5167 216.683 40.55C214.449 38.5833 213.233 35.8167 213.033 32.25C212.999 31.8167 212.983 31.0667 212.983 30C212.983 28.9333 212.999 28.1833 213.033 27.75C213.233 24.2167 214.483 21.4667 216.783 19.5C219.083 17.5 222.233 16.5 226.233 16.5C230.266 16.5 233.433 17.5 235.733 19.5C238.033 21.4667 239.283 24.2167 239.483 27.75C239.516 28.1833 239.533 28.9333 239.533 30C239.533 31.0667 239.516 31.8167 239.483 32.25C239.283 35.8167 238.066 38.5833 235.833 40.55C233.599 42.5167 230.399 43.5 226.233 43.5ZM226.233 37.4C227.699 37.4 228.783 36.9667 229.483 36.1C230.183 35.2 230.583 33.8333 230.683 32C230.716 31.6667 230.733 31 230.733 30C230.733 29 230.716 28.3333 230.683 28C230.583 26.2 230.166 24.85 229.433 23.95C228.733 23.05 227.666 22.6 226.233 22.6C223.466 22.6 221.999 24.4 221.833 28L221.783 30L221.833 32C221.899 33.8333 222.283 35.2 222.983 36.1C223.716 36.9667 224.799 37.4 226.233 37.4Z"
            fill="white"
          />
        </svg>
      )}
      {lightBG && (
        <svg
          width={width}
          height="35"
          viewBox="0 0 200 43"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 42.5831C0.895433 42.5831 0 41.6876 0 40.5831L0 21.709H37.5733V40.5831C37.5733 41.6876 36.6778 42.5831 35.5733 42.5831H2Z"
            fill={colorTextSecondary}
          />
          <path
            d="M0 20.8741L0 2.00005C0 0.895478 0.895431 4.57764e-05 2 4.57764e-05H35.5733C36.6778 4.57764e-05 37.5733 0.895476 37.5733 2.00005V20.8741H0Z"
            fill={colorTextSecondary}
          />
          <path
            d="M9.06421 35.9033C8.78589 35.9033 8.5354 35.8059 8.31274 35.6111C8.11792 35.3885 8.02051 35.138 8.02051 34.8596V7.72339C8.02051 7.41724 8.11792 7.16675 8.31274 6.97193C8.5354 6.7771 8.78589 6.67969 9.06421 6.67969H20.7537C24.3162 6.67969 27.1133 7.50073 29.145 9.14282C31.2046 10.7849 32.2344 13.1785 32.2344 16.3235C32.2344 19.4407 31.2185 21.7925 29.1868 23.3789C27.155 24.9375 24.344 25.7168 20.7537 25.7168H15.7857V34.8596C15.7857 35.1658 15.6743 35.4163 15.4517 35.6111C15.2568 35.8059 15.0064 35.9033 14.7002 35.9033H9.06421ZM20.5449 19.9556C21.7695 19.9556 22.7297 19.6494 23.4255 19.0371C24.1214 18.397 24.4693 17.4646 24.4693 16.24C24.4693 15.0989 24.1353 14.1943 23.4673 13.5264C22.8272 12.8306 21.853 12.4827 20.5449 12.4827H15.6604V19.9556H20.5449Z"
            fill="white"
          />
          <path
            d="M50.5156 36.3208C48.0664 36.3208 46.0903 35.4998 44.5874 33.8577C43.0845 32.1878 42.333 29.8638 42.333 26.8858V15.238C42.333 14.9319 42.4304 14.6814 42.6252 14.4866C42.8201 14.2918 43.0706 14.1943 43.3767 14.1943H48.5952C48.9014 14.1943 49.1519 14.2918 49.3467 14.4866C49.5693 14.6814 49.6807 14.9319 49.6807 15.238V26.6353C49.6807 29.3628 50.8914 30.7266 53.3128 30.7266C54.4817 30.7266 55.4002 30.3648 56.0681 29.6411C56.7361 28.9175 57.0701 27.9155 57.0701 26.6353V15.238C57.0701 14.9319 57.1675 14.6814 57.3623 14.4866C57.585 14.2918 57.8355 14.1943 58.1138 14.1943H63.3323C63.6384 14.1943 63.8889 14.2918 64.0838 14.4866C64.2786 14.6814 64.376 14.9319 64.376 15.238V34.8596C64.376 35.138 64.2786 35.3884 64.0838 35.6111C63.8889 35.8059 63.6384 35.9033 63.3323 35.9033H58.4895C58.2112 35.9033 57.9607 35.8059 57.738 35.6111C57.5432 35.3884 57.4458 35.138 57.4458 34.8596V33.2732C55.9985 35.3049 53.6885 36.3208 50.5156 36.3208Z"
            fill={colorTextSecondary}
          />
          <path
            d="M79.0557 36.3208C76.8013 36.3208 74.9087 36.0008 73.3779 35.3606C71.875 34.7205 70.7617 33.9551 70.0381 33.0645C69.3144 32.1738 68.9526 31.3806 68.9526 30.6848C68.9526 30.4065 69.05 30.1839 69.2449 30.0169C69.4675 29.822 69.7041 29.7246 69.9546 29.7246H74.7139C74.8808 29.7246 75.0339 29.7942 75.1731 29.9334C75.5071 30.156 75.7576 30.3369 75.9246 30.4761C76.5369 30.9214 77.0657 31.2554 77.511 31.478C77.9841 31.6729 78.5547 31.7703 79.2227 31.7703C80.0298 31.7703 80.6838 31.6172 81.1848 31.3111C81.7136 30.9771 81.978 30.5178 81.978 29.9334C81.978 29.4602 81.8389 29.0845 81.5605 28.8062C81.3101 28.5278 80.8091 28.2634 80.0576 28.013C79.3061 27.7346 78.165 27.4424 76.6343 27.1362C74.3242 26.6631 72.543 25.8977 71.2905 24.8401C70.0659 23.7547 69.4536 22.3074 69.4536 20.4983C69.4536 19.3572 69.8154 18.2717 70.5391 17.2419C71.2627 16.2122 72.3342 15.3772 73.7537 14.7371C75.2009 14.0969 76.9126 13.7769 78.8887 13.7769C80.8647 13.7769 82.5903 14.083 84.0654 14.6953C85.5405 15.3076 86.6538 16.0591 87.4053 16.9497C88.1846 17.8125 88.5742 18.6057 88.5742 19.3294C88.5742 19.5798 88.4768 19.8025 88.282 19.9973C88.115 20.1921 87.9062 20.2896 87.6558 20.2896H83.314C83.0913 20.2896 82.8826 20.22 82.6877 20.0808C82.3259 19.886 82.0059 19.6773 81.7275 19.4546C81.2544 19.0928 80.8091 18.8145 80.3916 18.6196C79.9741 18.4248 79.4592 18.3274 78.8469 18.3274C78.1233 18.3274 77.5388 18.4944 77.0935 18.8284C76.676 19.1624 76.4673 19.5938 76.4673 20.1226C76.4673 20.54 76.5786 20.8879 76.8013 21.1663C77.0517 21.4446 77.5527 21.7229 78.3042 22.0012C79.0835 22.2517 80.2246 22.5161 81.7275 22.7944C84.4272 23.2676 86.3894 24.1026 87.614 25.2993C88.8665 26.4961 89.4927 27.9016 89.4927 29.5159C89.4927 31.5755 88.5742 33.2315 86.7373 34.4839C84.9004 35.7085 82.3398 36.3208 79.0557 36.3208Z"
            fill={colorTextSecondary}
          />
          <path
            d="M105.015 35.9033C99.2536 35.9033 96.373 33.1619 96.373 27.679V19.6633H93.1166C92.8105 19.6633 92.546 19.5659 92.3234 19.3711C92.1286 19.1763 92.0312 18.9258 92.0312 18.6196V15.238C92.0312 14.9319 92.1286 14.6814 92.3234 14.4866C92.546 14.2918 92.8105 14.1943 93.1166 14.1943H96.373V7.30591C96.373 6.99976 96.4704 6.74927 96.6652 6.55444C96.8878 6.35962 97.1383 6.26221 97.4167 6.26221H102.259C102.566 6.26221 102.816 6.35962 103.011 6.55444C103.206 6.74927 103.303 6.99976 103.303 7.30591V14.1943H108.522C108.828 14.1943 109.078 14.2918 109.273 14.4866C109.496 14.6814 109.607 14.9319 109.607 15.238V18.6196C109.607 18.9258 109.496 19.1763 109.273 19.3711C109.078 19.5659 108.828 19.6633 108.522 19.6633H103.303V27.0945C103.303 29.1541 104.096 30.1839 105.683 30.1839H108.897C109.204 30.1839 109.454 30.2813 109.649 30.4761C109.844 30.6709 109.941 30.9214 109.941 31.2276V34.8596C109.941 35.138 109.844 35.3884 109.649 35.6111C109.454 35.8059 109.204 35.9033 108.897 35.9033H105.015Z"
            fill={colorTextSecondary}
          />
          <path
            d="M124.503 36.3208C121.052 36.3208 118.394 35.4998 116.529 33.8577C114.664 32.2156 113.648 29.9055 113.481 26.9275C113.453 26.5657 113.439 25.9395 113.439 25.0488C113.439 24.1582 113.453 23.532 113.481 23.1702C113.648 20.22 114.692 17.9238 116.612 16.2817C118.533 14.6118 121.163 13.7769 124.503 13.7769C127.87 13.7769 130.514 14.6118 132.435 16.2817C134.355 17.9238 135.399 20.22 135.566 23.1702C135.594 23.532 135.608 24.1582 135.608 25.0488C135.608 25.9395 135.594 26.5657 135.566 26.9275C135.399 29.9055 134.383 32.2156 132.518 33.8577C130.654 35.4998 127.982 36.3208 124.503 36.3208ZM124.503 31.2276C125.727 31.2276 126.632 30.8657 127.216 30.1421C127.801 29.3906 128.135 28.2495 128.218 26.7188C128.246 26.4404 128.26 25.8838 128.26 25.0488C128.26 24.2139 128.246 23.6572 128.218 23.3789C128.135 21.876 127.787 20.7488 127.175 19.9973C126.59 19.2459 125.699 18.8701 124.503 18.8701C122.193 18.8701 120.968 20.3731 120.829 23.3789L120.787 25.0488L120.829 26.7188C120.885 28.2495 121.205 29.3906 121.789 30.1421C122.401 30.8657 123.306 31.2276 124.503 31.2276Z"
            fill={colorTextSecondary}
          />
          <path
            d="M141.633 35.9033C141.355 35.9033 141.104 35.8059 140.882 35.6111C140.687 35.3884 140.589 35.138 140.589 34.8596V7.30591C140.589 6.99976 140.687 6.74927 140.882 6.55444C141.104 6.35962 141.355 6.26221 141.633 6.26221H146.476C146.782 6.26221 147.032 6.35962 147.227 6.55444C147.422 6.74927 147.52 6.99976 147.52 7.30591V21.2915L153.323 14.9041C153.378 14.8484 153.476 14.751 153.615 14.6118C153.782 14.4727 153.949 14.3752 154.116 14.3196C154.283 14.2361 154.478 14.1943 154.7 14.1943H160.294C160.545 14.1943 160.754 14.2918 160.921 14.4866C161.116 14.6536 161.213 14.8623 161.213 15.1128C161.213 15.419 161.102 15.6555 160.879 15.8225L153.364 23.9216L161.923 34.3169C162.145 34.5396 162.257 34.7483 162.257 34.9431C162.257 35.2215 162.159 35.458 161.964 35.6529C161.797 35.8198 161.575 35.9033 161.296 35.9033H155.577C155.215 35.9033 154.937 35.8477 154.742 35.7363C154.575 35.625 154.366 35.4441 154.116 35.1936L147.52 27.2615V34.8596C147.52 35.138 147.422 35.3884 147.227 35.6111C147.032 35.8059 146.782 35.9033 146.476 35.9033H141.633Z"
            fill={colorTextSecondary}
          />
          <path
            d="M166.847 11.0632C166.541 11.0632 166.291 10.9658 166.096 10.771C165.901 10.5762 165.804 10.3257 165.804 10.0195V6.26221C165.804 5.95605 165.901 5.70557 166.096 5.51074C166.291 5.31592 166.541 5.21851 166.847 5.21851H171.857C172.163 5.21851 172.414 5.31592 172.609 5.51074C172.803 5.70557 172.901 5.95605 172.901 6.26221V10.0195C172.901 10.3257 172.803 10.5762 172.609 10.771C172.414 10.9658 172.163 11.0632 171.857 11.0632H166.847ZM166.889 35.9033C166.583 35.9033 166.332 35.8059 166.138 35.6111C165.943 35.4163 165.845 35.1658 165.845 34.8596V15.238C165.845 14.9319 165.943 14.6814 166.138 14.4866C166.332 14.2918 166.583 14.1943 166.889 14.1943H171.815C172.121 14.1943 172.372 14.2918 172.567 14.4866C172.762 14.6814 172.859 14.9319 172.859 15.238V34.8596C172.859 35.138 172.762 35.3884 172.567 35.6111C172.372 35.8059 172.121 35.9033 171.815 35.9033H166.889Z"
            fill={colorTextSecondary}
          />
          <path
            d="M188.896 36.3208C185.445 36.3208 182.787 35.4998 180.922 33.8577C179.057 32.2156 178.041 29.9055 177.874 26.9275C177.846 26.5657 177.833 25.9395 177.833 25.0488C177.833 24.1582 177.846 23.532 177.874 23.1702C178.041 20.22 179.085 17.9238 181.005 16.2817C182.926 14.6118 185.556 13.7769 188.896 13.7769C192.263 13.7769 194.908 14.6118 196.828 16.2817C198.748 17.9238 199.792 20.22 199.959 23.1702C199.987 23.532 200.001 24.1582 200.001 25.0488C200.001 25.9395 199.987 26.5657 199.959 26.9275C199.792 29.9055 198.776 32.2156 196.911 33.8577C195.047 35.4998 192.375 36.3208 188.896 36.3208ZM188.896 31.2276C190.12 31.2276 191.025 30.8657 191.609 30.1421C192.194 29.3906 192.528 28.2495 192.611 26.7188C192.639 26.4404 192.653 25.8838 192.653 25.0488C192.653 24.2139 192.639 23.6572 192.611 23.3789C192.528 21.876 192.18 20.7488 191.568 19.9973C190.983 19.2459 190.093 18.8701 188.896 18.8701C186.586 18.8701 185.361 20.3731 185.222 23.3789L185.18 25.0488L185.222 26.7188C185.278 28.2495 185.598 29.3906 186.182 30.1421C186.795 30.8657 187.699 31.2276 188.896 31.2276Z"
            fill={colorTextSecondary}
          />
        </svg>
      )}
    </>
  );
};
