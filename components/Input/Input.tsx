import { Label } from 'components/Label';
import { FormikError } from 'components/FormikError';
import InputBox from '../InputBox';
import { useField } from 'formik';

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
  } = props;

  const [field, meta] = useField(props);

  return (
    <Label
      labelAtTop={labelAtTop}
      isRequired={isRequired}
      labelText={labelText}
      labelMinWidth={labelMinWidth}
      marginBottom={marginBottom}
    >
      <InputBox
        type={type}
        placeholder={placeholder}
        isFullWidth={inputFieldFullWidth}
        labelAtTop={labelAtTop}
        {...field}
      />
      <FormikError
        hasGutter={!labelAtTop}
        isTouched={meta.touched}
        error={meta.error}
      />
    </Label>
  );
};
