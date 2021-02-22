import React from 'react';
import { ButtonATag, ButtonBTag } from './Button.styles';
import { ReactNode } from 'react';

export interface ButtonProps {
  children: ReactNode;
  color?: 'white' | 'pink';
  onClick?: () => void;
  asButtonTag?: boolean;
  type?: 'submit' | 'reset' | 'button';
  href?: string;
  disabled?: boolean;
}

export const Button = React.forwardRef(
  (
    {
      color = 'pink',
      onClick,
      asButtonTag = false,
      children,
      type,
      href,
      disabled,
    }: ButtonProps,
    ref,
  ): JSX.Element => {
    return (
      <>
        {asButtonTag ? (
          <ButtonBTag
            disabled={disabled}
            type={type}
            onClick={onClick}
            color={color}
          >
            {children}
          </ButtonBTag>
        ) : (
          <ButtonATag onClick={onClick} color={color} href={href}>
            {children}
          </ButtonATag>
        )}
      </>
    );
  },
);
