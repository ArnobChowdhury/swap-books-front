import { createContext, Dispatch, SetStateAction } from 'react';

export type PopupType =
  | 'requireLoginOrSignup'
  | 'login'
  | 'addABook'
  | 'location'
  | 'editBook'
  | 'swapBook'
  | 'userOptions'
  | null;

export type ContentType = 'Messages' | 'Notifications' | 'User' | 'Posts';

export type UserProfileTabType = 'Available to Swap' | 'Swap Request Pending';
export interface RootContextProps {
  showModal: boolean;
  popupType: PopupType;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  setPopupType: Dispatch<SetStateAction<PopupType>>;
  contentType: ContentType;
  setContentType: Dispatch<SetStateAction<ContentType>>;
  showDropDown: boolean;
  setShowDropDown: Dispatch<SetStateAction<boolean>>;
  selectedTabUserProfile: UserProfileTabType;
  setSelectedTabUserProfile: Dispatch<SetStateAction<UserProfileTabType>>;
}

export const RootContext = createContext<RootContextProps | null>(null);
