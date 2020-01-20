import React from 'react';
import { InputHTML } from './InputBox.styles';

export interface InputBoxProps {
  value?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password';
  onChange?: React.FormEventHandler<HTMLInputElement>;
  isFullWidth?: boolean;
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
}: InputBoxProps): JSX.Element => {
  return (
    <InputHTML
      value={value}
      type={type}
      onChange={onChange}
      placeholder={placeholder}
      {...{ isFullWidth }}
    />
  );
};

export default InputBox;
