import React, { ReactNode, MouseEvent } from 'react';
import { Button } from './PostButtonSmall.styles';

export interface PostButtonSmallProps {
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  requestOnGoing?: boolean;
  disabled?: boolean;
  icon: ReactNode;
}

export const PostButtonSmall = ({
  onClick,
  requestOnGoing,
  disabled,
  icon,
}: PostButtonSmallProps): JSX.Element => {
  return (
    <Button
      requestOnGoing={requestOnGoing}
      onClick={onClick}
      disabled={disabled || requestOnGoing}
    >
      {icon}
    </Button>
  );
};
