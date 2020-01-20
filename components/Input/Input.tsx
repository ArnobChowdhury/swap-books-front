import React from 'react';
import { InputHTML } from './Input.styles';

export interface InputProps {
  value?: string | number;
  placeholder?: string;
  type?: 'text' | 'email' | 'password';
  onChange?: React.FormEventHandler<HTMLInputElement>;
  isFullWidth?: boolean;
}

/**
 *
 * Use this `Input` component for Email, Password or Text but not for Text Area or search
 */
const Input: React.FC<InputProps> = ({
  value = '',
  type = 'text',
  placeholder,
  onChange,
  isFullWidth = false,
}: InputProps): JSX.Element => {
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

export default Input;
