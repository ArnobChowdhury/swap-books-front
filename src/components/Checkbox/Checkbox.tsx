import { Label } from 'ui-kits/Label';
import { ChekcBoxHTML, ChekcBoxContainer } from './Checkbox.styles';
import { useField } from 'formik';
import { FormikError } from 'ui-kits/FormikError';
import { ReactNode } from 'react';
interface CheckboxProps {
  labelText: string | ReactNode;
  name: string;
  value?: string;
}

export const Checkbox = (props: CheckboxProps): JSX.Element => {
  const { labelText, name } = props;
  const [field, meta] = useField(props);

  return (
    <>
      <ChekcBoxContainer>
        <ChekcBoxHTML type="checkbox" {...field} id={name} />
        <Label labelAtTop labelText={labelText} htmlFor={name}></Label>
      </ChekcBoxContainer>
      <FormikError hasGutter={false} isTouched={meta.touched} error={meta.error} />
    </>
  );
};
