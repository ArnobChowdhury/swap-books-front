import { ButtonATag, ButtonBTag } from './Button.styles';
import { ReactNode } from 'react';

export interface ButtonProps {
  children: ReactNode;
  color?: 'white' | 'pink';
  onClick?: () => void;
  asButtonTag?: boolean;
  type?: 'submit' | 'reset' | 'button';
  // fontMedium?: boolean;
  href?: string;
}

export const Button: React.FC<ButtonProps> = ({
  color = 'pink',
  onClick,
  asButtonTag = false,
  children,
  type,
  href,
}: ButtonProps): JSX.Element => {
  return (
    <>
      {asButtonTag ? (
        <ButtonBTag type={type} onClick={onClick} color={color}>
          {children}
        </ButtonBTag>
      ) : (
        <ButtonATag onClick={onClick} color={color} href={href}>
          {children}
        </ButtonATag>
      )}
    </>
  );
};
