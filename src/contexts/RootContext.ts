import { createContext, Dispatch, SetStateAction } from 'react';

export type PopupType =
  | 'requireLoginOrSignup'
  | 'login'
  | 'signup'
  | 'addABook'
  | 'location'
  | null;

export interface RootContextProps {
  showModal: boolean;
  popupType: PopupType;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  setPopupType: Dispatch<SetStateAction<PopupType>>;
}

export const RootContext = createContext<RootContextProps | null>(null);
