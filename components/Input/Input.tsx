import React from 'react';
import { InputHTML } from './Input.styles';

export interface InputProps {
  value?: string | number;
  placeholder?: string;
  type?: 'text' | 'email' | 'password';
  /** Pass the onChange function to get value */
  onChange?: React.FormEventHandler<HTMLInputElement>;
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
}: InputProps): JSX.Element => {
  return (
    <InputHTML
      value={value}
      type={type}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};

export default Input;
