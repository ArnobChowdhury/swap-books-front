import { StyledButton, ButtonText } from './IconButton.styles';
import { ReactNode } from 'react';

export interface IconButtonProps {
  icon: ReactNode;
  textColor?: 'primary' | 'secondary';
  onClick?: () => void;
  buttonText?: string;
  fontSize?: number;
}

export const IconButton: React.FC<IconButtonProps> = ({
  onClick,
  icon,
  textColor,
  buttonText,
  fontSize,
}: IconButtonProps): JSX.Element => {
  return (
    <StyledButton
      fontSize={fontSize}
      type="button"
      onClick={onClick}
      textColor={textColor}
    >
      {icon}
      <ButtonText>{buttonText}</ButtonText>
    </StyledButton>
  );
};
