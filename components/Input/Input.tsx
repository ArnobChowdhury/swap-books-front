import React from 'react';
import InputBox from '../InputBox';
import { Label, RequiredSpan, LabelSpan } from './Input.styles';

export interface InputProps {
  labelText: string | undefined;
  type: 'text' | 'email' | 'password';
  value: string;
  placeholder?: string;
  onChangeFunc?: React.FormEventHandler<HTMLInputElement>;
  inputFieldFullWidth?: boolean;
  isRequired?: boolean;
  labelAtTop?: boolean;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  labelText = '',
  value = '',
  onChangeFunc,
  inputFieldFullWidth,
  placeholder,
  isRequired = false,
  labelAtTop = false,
}: InputProps) => {
  return (
    <Label {...{ labelAtTop }}>
      <LabelSpan {...{ labelAtTop }}>
        {isRequired && !labelAtTop ? (
          <RequiredSpan {...{ labelAtTop }}>*</RequiredSpan>
        ) : null}
        {labelText}
        {isRequired && labelAtTop ? (
          <RequiredSpan {...{ labelAtTop }}> (Required)</RequiredSpan>
        ) : null}
      </LabelSpan>
      <InputBox
        type={type}
        value={value}
        onChange={onChangeFunc}
        placeholder={placeholder ? placeholder : undefined}
        isFullWidth={inputFieldFullWidth}
        labelAtTop={labelAtTop}
      />
    </Label>
  );
};

export default Input;
