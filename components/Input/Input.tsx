import InputBox from '../InputBox';
import {
  Label,
  RequiredSpan,
  LabelSpan,
  ErrorWrapper,
  ErrorText,
  ErrorGutter,
} from './Input.styles';
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
  labelMinWidth?: string;
  marginBottom?: string;
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
    labelMinWidth,
    marginBottom,
  } = props;

  const [field, meta] = useField(props);

  return (
    <Label
      {...{ labelAtTop }}
      data-testid="inputLabelTestid"
      marginBottom={marginBottom}
    >
      <LabelSpan {...{ labelAtTop }} labelMinWidth={labelMinWidth}>
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
        placeholder={placeholder}
        isFullWidth={inputFieldFullWidth}
        labelAtTop={labelAtTop}
        {...field}
      />
      <ErrorWrapper>
        <ErrorGutter />
        {/* <ErrorText>Too short. Needs minimum 8 characters</ErrorText> */}
        {meta.touched && meta.error ? <ErrorText>{meta.error}</ErrorText> : null}
      </ErrorWrapper>
    </Label>
  );
};
