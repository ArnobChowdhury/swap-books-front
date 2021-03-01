import React, { MouseEvent } from 'react';
import { Button } from './InterestButtonSmall.styles';
import { InterestIcon } from 'assets/InterestIcon';

export interface InterestButtonSmallProps {
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  isSelected?: boolean;
  requestOnGoing?: boolean;
  disabled?: boolean;
}

export const InterestButtonSmall = ({
  onClick,
  isSelected,
  requestOnGoing,
  disabled,
}: InterestButtonSmallProps): JSX.Element => {
  return (
    <Button requestOnGoing={requestOnGoing} onClick={onClick} disabled={disabled}>
      <InterestIcon lightBorder hasBodyColor={isSelected} width="40" height="40" />
    </Button>
  );
};
