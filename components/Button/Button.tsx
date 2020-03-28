import { ButtonATag, ButtonBTag } from './Button.styles';
interface ButtonProps {
  title: string;
  isYellow?: boolean;
  onClick: () => void;
  asButtonTag?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  isYellow = false,
  onClick,
  asButtonTag = false,
}: ButtonProps): JSX.Element => {
  return (
    <>
      {asButtonTag ? (
        <ButtonBTag onClick={onClick} {...(isYellow ? { isYellow } : {})}>
          {title}
        </ButtonBTag>
      ) : (
        <ButtonATag onClick={onClick} {...(isYellow ? { isYellow } : {})}>
          {title}
        </ButtonATag>
      )}
    </>
  );
};
