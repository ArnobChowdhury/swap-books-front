import InputBox from '../InputBox';
import { Label, RequiredSpan, LabelSpan } from './Input.styles';
import { useField } from 'formik';

export interface InputProps {
  labelText: string | undefined;
  name: string;
  type: 'text' | 'email' | 'password';
  value: string;
  placeholder?: string;
  onChangeFunc?: React.FormEventHandler<HTMLInputElement>;
  inputFieldFullWidth?: boolean;
  isRequired?: boolean;
  labelAtTop?: boolean;
}

/**
 * Use `Input` component for text, email or Password but not for Text area or search
 */
export const Input: React.FC<InputProps> = (props: InputProps) => {
  const {
    type = 'text',
    name,
    labelText = '',
    value = '',
    onChangeFunc,
    inputFieldFullWidth,
    placeholder,
    isRequired = false,
    labelAtTop = false,
  } = props;

  const [field, meta] = useField(props);

  return (
    <Label {...{ labelAtTop }} data-testid="inputLabelTestid">
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
        name={name}
        type={type}
        value={value}
        onChange={onChangeFunc}
        placeholder={placeholder ? placeholder : undefined}
        isFullWidth={inputFieldFullWidth}
        labelAtTop={labelAtTop}
        {...field}
      />
      {meta.touched && meta.error ? <div>{meta.error}</div> : null}
    </Label>
  );
};
