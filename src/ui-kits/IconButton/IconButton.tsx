import { StyledButton, ButtonText } from './IconButton.styles';
import { ReactNode, MouseEvent } from 'react';

export interface IconButtonProps {
  icon: ReactNode;
  textColor?: 'primary' | 'secondary';
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  buttonText?: string;
  fontSize?: number;
  disabled?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  onClick,
  icon,
  textColor,
  buttonText,
  fontSize,
  disabled,
}: IconButtonProps): JSX.Element => {
  return (
    <StyledButton
      fontSize={fontSize}
      type="button"
      onClick={onClick}
      textColor={textColor}
      disabled={disabled}
    >
      {icon}
      <ButtonText>{buttonText}</ButtonText>
    </StyledButton>
  );
};
