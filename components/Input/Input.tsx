import React from 'react';
import InputBox from '../InputBox';

export interface InputProps {
  labelText: string;
  type: 'text' | 'email' | 'password';
  value: string;
  onChangeFunc?: React.FormEventHandler<HTMLInputElement>;
  inputFieldFullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  labelText,
  value = '',
  onChangeFunc,
  inputFieldFullWidth = true,
}: InputProps) => {
  return (
    <div>
      <label>{labelText}</label>
      <InputBox
        type={type}
        value={value}
        onChange={onChangeFunc}
        isFullWidth={inputFieldFullWidth}
      />
    </div>
  );
};

export default Input;
