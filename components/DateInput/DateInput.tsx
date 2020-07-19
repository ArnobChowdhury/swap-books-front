import { useState, ChangeEvent, useEffect, useRef } from 'react';
import { DateInputWrapper, Input } from './DateInput.styles';
import { Label } from 'components/Label';

function daysInAMonth(month: number, year?: number) {
  return new Date(year || 2019, month, 0).getDate();
}

const currentYear = new Date().getFullYear();

interface DateInputProps {
  name: string;
  labelText?: string;
  onChange?: (event: HTMLInputElement) => void;
  marginBottom?: string;
  isRequired?: boolean;
}

export const DateInput = ({
  name,
  labelText,
  onChange,
  marginBottom,
  isRequired,
}: DateInputProps): JSX.Element => {
  const [maxDate, setMaxDate] = useState(31);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedDays, setSelectedDays] = useState<string>('');
  const [dateVal, setDateVal] = useState('');

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
    if (selectedMonth) {
      setMaxDate(daysInAMonth(Number(selectedMonth), Number(selectedYear)));
    }
    if (selectedMonth || selectedDays || selectedYear) {
      setDateVal(
        `${selectedYear || '0'}-${selectedMonth || 0}-${selectedDays || 0}`,
      );
    }
  }, [selectedMonth, selectedYear, selectedDays]);

  const hiddenInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (onChange && hiddenInput.current) {
      onChange(hiddenInput.current);
    }
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
            style={{ display: 'none' }}
            type="hidden"
            name={name}
            id="dateinput"
            value={dateVal}
            ref={hiddenInput}
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
      </Label>
    </>
  );
};
