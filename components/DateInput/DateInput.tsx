import { useState, ChangeEvent, useEffect, useRef } from 'react';
import { DateInputWrapper, Input } from './DateInput.styles';
import { Label } from 'components/Label';
import { FormikError } from 'components/FormikError';
import { useField } from 'formik';

function daysInAMonth(month: number, year?: number) {
  return new Date(year || 2019, month, 0).getDate();
}

const currentYear = new Date().getFullYear();

interface DateInputProps {
  name: string;
  value?: string;
  labelText?: string;
  marginBottom?: string;
  isRequired?: boolean;
}

export const DateInput = (props: DateInputProps): JSX.Element => {
  const { labelText, marginBottom, isRequired } = props;

  const [maxDate, setMaxDate] = useState(31);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedDays, setSelectedDays] = useState<string>('');
  const [dateVal, setDateVal] = useState('');

  const [field, meta, helpers] = useField(props);

  const { name: formikName, value: formikValue } = field;

  const handleDateChange = (
    monthevent: ChangeEvent<HTMLInputElement> | undefined,
    dayevent: ChangeEvent<HTMLInputElement> | undefined,
    yearevent: ChangeEvent<HTMLInputElement> | undefined,
  ) => {
    if (monthevent) {
      setSelectedMonth(monthevent.currentTarget.value);
    }
    if (dayevent) {
      setSelectedDays(dayevent.currentTarget.value);
    }
    if (yearevent) {
      setSelectedYear(yearevent.currentTarget.value);
    }
  };

  useEffect(() => {
    if (formikValue) {
      const dateArr = formikValue.split('-');
      dateArr[0] !== '0' && setSelectedYear(dateArr[0]);
      dateArr[1] !== '0' && setSelectedMonth(dateArr[1]);
      dateArr[2] !== '0' && setSelectedDays(dateArr[2]);
    }
  }, [formikValue]);

  useEffect(() => {
    if (selectedMonth) {
      setMaxDate(daysInAMonth(Number(selectedMonth), Number(selectedYear)));
    }
    if (selectedMonth || selectedDays || selectedYear) {
      setDateVal(
        `${selectedYear || '0'}-${selectedMonth || 0}-${selectedDays || 0}`,
      );
    }
  }, [selectedMonth, selectedYear, selectedDays]);

  useEffect(() => {
    helpers.setValue(dateVal);
  }, [dateVal]);

  return (
    <>
      <Label
        labelText={labelText}
        isRequired={isRequired}
        marginBottom={marginBottom}
        labelAtTop
      >
        <DateInputWrapper>
          <input
            type="hidden"
            name={formikName}
            id="dateinput"
            value={formikValue}
            required
          />
          <Input
            type="number"
            placeholder="m | m"
            value={selectedMonth}
            min={1}
            max={12}
            maxLength={2}
            onChange={e => handleDateChange(e, undefined, undefined)}
            required
          />
          <Input
            type="number"
            placeholder="d | d"
            value={selectedDays}
            min={1}
            max={maxDate}
            maxLength={2}
            onChange={e => handleDateChange(undefined, e, undefined)}
            required
          />
          <Input
            type="number"
            placeholder="y | y | y | y"
            value={selectedYear}
            onChange={e => handleDateChange(undefined, undefined, e)}
            doubleWidth
            min={1900}
            max={currentYear}
            maxLength={4}
            required
          />
        </DateInputWrapper>
        <FormikError hasGutter={false} isTouched={meta.touched} error={meta.error} />
      </Label>
    </>
  );
};
