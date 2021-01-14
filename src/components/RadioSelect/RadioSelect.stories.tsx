import { RadioSelect } from './RadioSelect';

export default {
  title: 'RadioSelect',
  component: RadioSelect,
};

export const Default = (): JSX.Element => {
  return (
    <RadioSelect
      name="sex"
      options={[
        { value: 'male', labelText: 'Male' },
        { value: 'female', labelText: 'Female' },
      ]}
    />
  );
};
