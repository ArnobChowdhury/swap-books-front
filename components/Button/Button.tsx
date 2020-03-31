import { ButtonATag, ButtonBTag } from './Button.styles';
import { ReactNode } from 'react';

export interface ButtonProps {
  children: ReactNode;
  color?: 'yellow' | 'dark' | 'transparent';
  onClick?: () => void;
  asButtonTag?: boolean;
  type?: 'submit' | 'reset' | 'button';
}

export const Button: React.FC<ButtonProps> = ({
  color = 'transparent',
  onClick,
  asButtonTag = false,
  children,
  type,
}: ButtonProps): JSX.Element => {
  return (
    <>
      {asButtonTag ? (
        <ButtonBTag type={type} onClick={onClick} color={color}>
          {children}
        </ButtonBTag>
      ) : (
        <ButtonATag onClick={onClick} color={color}>
          {children}
        </ButtonATag>
      )}
    </>
  );
};
