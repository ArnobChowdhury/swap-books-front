import { StyledButton, ButtonText } from './IconButton.styles';
import { ReactNode, MouseEvent } from 'react';

export interface IconButtonProps {
  icon: ReactNode;
  textColor?: 'primary' | 'secondary';
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  buttonText?: string;
  fontSize?: number;
  disabled?: boolean;
  requestOngoing?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  onClick,
  icon,
  textColor,
  buttonText,
  fontSize,
  disabled,
  requestOngoing,
}: IconButtonProps): JSX.Element => {
  return (
    <StyledButton
      fontSize={fontSize}
      type="button"
      onClick={onClick}
      textColor={textColor}
      disabled={disabled}
      requestOngoing={requestOngoing}
    >
      {icon}
      <ButtonText>{buttonText}</ButtonText>
    </StyledButton>
  );
};
