import { RadioInput } from 'components/RadioInput';
import { Label as FormHeading } from 'components/Label';
import { useField } from 'formik';
import { FormikError } from 'components/FormikError';

interface RadioOptions {
  value: string;
  labelText: string;
}
interface RadioSelectProps {
  options: RadioOptions[];
  name: string;
}

export const RadioSelect = (props: RadioSelectProps): JSX.Element => {
  const { options } = props;
  const [field, meta] = useField(props);

  return (
    <FormHeading labelText="Sex" labelAtTop isRequired as="div">
      <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center' }}>
        {options.map(({ value, labelText }) => {
          return (
            <RadioInput
              name={field.name}
              labelText={labelText}
              value={value}
              onChange={field.onChange}
              checked={value === field.value}
              key={value}
            />
          );
        })}
      </div>
      <FormikError hasGutter={false} isTouched={meta.touched} error={meta.error} />
    </FormHeading>
  );
};
