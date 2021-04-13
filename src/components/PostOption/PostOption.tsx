import { MouseEvent, useState, useCallback, ReactNode, useRef } from 'react';
import { PostOptionIcon } from 'assets/PostOptionIcon';
import { IconOnlyButton } from 'ui-kits/IconOnlyButton';
import { OptionsContainer, IconContainer, Option } from './PostOption.styles';
import { LoaderBook } from 'assets/LoaderBook';
import { RequestResult } from 'components/RequestResult';
import { useOnClickOutside } from 'hooks';

interface Option {
  name?: string;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  iconComponent?: ReactNode;
}

export interface PostOptionProps {
  options: Option[];
  availableTenMoreDaysReqOnGoing?: boolean;
  availableTenMoreDaysSuccessMsg?: string | null;
  availableTenMoreDaysErr?: { message: string; status: number } | null;
}

export const PostOption: React.FC<PostOptionProps> = ({
  options,
  availableTenMoreDaysReqOnGoing,
  availableTenMoreDaysSuccessMsg,
  availableTenMoreDaysErr,
}: PostOptionProps): JSX.Element => {
  const [showOptionDropDown, setShowOptionDropDown] = useState<boolean>(false);

  const optionDropDownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback(() => {
    setShowOptionDropDown(false);
  }, []);

  useOnClickOutside(optionDropDownRef, triggerRef, handleClickOutside);

  const optionsAsListItem = options.map(({ iconComponent, name, onClick }, ind) => (
    <Option key={ind} onClick={onClick}>
      {iconComponent}
      {name}
    </Option>
  ));

  const showOptions =
    !availableTenMoreDaysReqOnGoing &&
    !availableTenMoreDaysSuccessMsg &&
    !availableTenMoreDaysErr;

  return (
    <>
      <IconContainer ref={triggerRef}>
        <IconOnlyButton
          size={24}
          onClick={() => setShowOptionDropDown(!showOptionDropDown)}
        >
          <PostOptionIcon />
        </IconOnlyButton>
      </IconContainer>
      {showOptionDropDown && (
        <OptionsContainer reqShowing={!showOptions} ref={optionDropDownRef}>
          {showOptions && optionsAsListItem}
          {availableTenMoreDaysReqOnGoing && <LoaderBook text="Extending" />}
          {availableTenMoreDaysSuccessMsg && (
            <RequestResult
              noBottomMarginAfterIcon
              msg={availableTenMoreDaysSuccessMsg}
              reqStatus="success"
            />
          )}
          {availableTenMoreDaysErr && (
            <RequestResult
              noBottomMarginAfterIcon
              msg={availableTenMoreDaysErr.message}
              reqStatus="error"
            />
          )}
        </OptionsContainer>
      )}
    </>
  );
};
