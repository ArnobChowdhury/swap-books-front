import React from 'react';
import { ButtonATag, ButtonBTag } from './Button.styles';
import { ReactNode } from 'react';

export interface ButtonProps {
  children: ReactNode;
  color?: 'white' | 'blue' | 'transparent';
  onClick?: () => void;
  asButtonTag?: boolean;
  type?: 'submit' | 'reset' | 'button';
  href?: string;
  disabled?: boolean;
  isFullWidth?: boolean;
}

export const Button = React.forwardRef(
  (
    {
      color = 'blue',
      onClick,
      asButtonTag = false,
      children,
      type,
      href,
      disabled,
      isFullWidth = false,
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
            isFullWidth={isFullWidth}
          >
            {children}
          </ButtonBTag>
        ) : (
          <ButtonATag
            isFullWidth={isFullWidth}
            onClick={onClick}
            color={color}
            href={href}
          >
            {children}
          </ButtonATag>
        )}
      </>
    );
  },
);
