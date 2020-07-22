import { ButtonATag, ButtonBTag } from './Button.styles';
import { ReactNode } from 'react';

export interface ButtonProps {
  children: ReactNode;
  color?: 'yellow' | 'dark' | 'transparent';
  onClick?: () => void;
  asButtonTag?: boolean;
  type?: 'submit' | 'reset' | 'button';
  fontMedium?: boolean;
  href?: string;
}

export const Button: React.FC<ButtonProps> = ({
  color = 'transparent',
  onClick,
  asButtonTag = false,
  children,
  type,
  fontMedium = false,
  href,
}: ButtonProps): JSX.Element => {
  return (
    <>
      {asButtonTag ? (
        <ButtonBTag
          type={type}
          onClick={onClick}
          color={color}
          fontMedium={fontMedium}
        >
          {children}
        </ButtonBTag>
      ) : (
        <ButtonATag
          onClick={onClick}
          color={color}
          fontMedium={fontMedium}
          href={href}
        >
          {children}
        </ButtonATag>
      )}
    </>
  );
};
