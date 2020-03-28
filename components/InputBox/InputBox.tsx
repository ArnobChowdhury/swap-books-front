import { InputHTML } from './InputBox.styles';

export interface InputBoxProps {
  name: string;
  value?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password';
  onChange?: React.FormEventHandler<HTMLInputElement>;
  isFullWidth?: boolean;
  labelAtTop?: boolean;
}

/**
 *
 * Use this `Input` component for Email, Password or Text but not for Text Area or search
 */
const InputBox: React.FC<InputBoxProps> = ({
  value = '',
  type = 'text',
  placeholder,
  onChange,
  isFullWidth = false,
  labelAtTop = false,
  name,
}: InputBoxProps): JSX.Element => {
  return (
    <InputHTML
      name={name}
      value={value}
      type={type}
      onChange={onChange}
      placeholder={placeholder}
      {...{ isFullWidth }}
      {...{ labelAtTop }}
      data-testid="inputFieldTestid"
    />
  );
};

export default InputBox;
