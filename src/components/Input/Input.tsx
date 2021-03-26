import React, { useState } from 'react';
import { Label } from 'ui-kits/Label';
import { FormikError } from 'ui-kits/FormikError';
import { InputBox } from 'ui-kits/InputBox';
import { useField } from 'formik';
import { InputContainer, ShowPasswordWrapper } from './Input.styles';
import { Show } from 'assets/Show';
import { Hide } from 'assets/Hide';

export interface InputProps {
  labelText: string | undefined;
  name: string;
  type: 'text' | 'email' | 'password';
  value?: string;
  placeholder?: string;
  onChangeFunc?: React.FormEventHandler<HTMLInputElement>;
  inputFieldFullWidth?: boolean;
  isRequired?: boolean;
  labelAtTop?: boolean;
  labelMinWidth?: string;
  marginBottom?: string;
  autoFocus?: boolean;
}

/**
 * Use `Input` component for text, email or Password but not for Text area or search
 */
export const Input: React.FC<InputProps> = (props: InputProps) => {
  const {
    type = 'text',
    labelText = '',
    inputFieldFullWidth,
    placeholder,
    isRequired = false,
    labelAtTop = false,
    labelMinWidth,
    marginBottom,
    autoFocus,
  } = props;

  const [field, meta] = useField(props);

  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <Label
      labelAtTop={labelAtTop}
      isRequired={isRequired}
      labelText={labelText}
      labelMinWidth={labelMinWidth}
      marginBottom={marginBottom}
    >
      <InputContainer>
        <InputBox
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          placeholder={placeholder}
          isFullWidth={inputFieldFullWidth}
          labelAtTop={labelAtTop}
          autoFocus={autoFocus}
          {...field}
        />
        {type === 'password' && (
          <ShowPasswordWrapper onClick={() => setShowPassword(!showPassword)}>
            {!showPassword && <Show />}
            {showPassword && <Hide />}
          </ShowPasswordWrapper>
        )}
      </InputContainer>
      <FormikError
        hasGutter={!labelAtTop}
        isTouched={meta.touched}
        error={meta.error}
      />
    </Label>
  );
};
