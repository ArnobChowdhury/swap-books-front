import { StyledInput } from './FileInput.styles';
import { useField } from 'formik';
import { FormikError } from 'ui-kits/FormikError';
import { Label } from 'ui-kits/Label';

interface FileInputProps {
  name: string;
  labelText: string;
}

export const FileInput = (props: FileInputProps) => {
  const { labelText } = props;
  const [field, meta, helpers] = useField(props);
  const { name, onBlur } = field;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    helpers.setValue(event.target.files?.[0]);
  };

  return (
    <Label labelAtTop labelText={labelText}>
      <StyledInput
        type="file"
        name={name}
        onChange={handleFileChange}
        onBlur={onBlur}
      />
      <FormikError isTouched={meta.touched} error={meta.error} />
    </Label>
  );
};
