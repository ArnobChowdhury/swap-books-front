import { ButtonStyled } from './Button.styles';
export interface ButtonProps {
  title: string;
  isYellow: boolean;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({
  title,
  isYellow = false,
  onClick,
}: ButtonProps): JSX.Element => {
  return (
    <ButtonStyled onClick={onClick} {...{ isYellow }}>
      {title}
    </ButtonStyled>
  );
};

export default Button;
