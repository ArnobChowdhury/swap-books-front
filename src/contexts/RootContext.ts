import { createContext, Dispatch, SetStateAction } from 'react';

export type PopupType =
  | 'requireLoginOrSignup'
  | 'login'
  | 'addABook'
  | 'location'
  | null;

export type ContentType = 'Messages' | 'Notifications' | 'User' | 'Posts';

export interface RootContextProps {
  showModal: boolean;
  popupType: PopupType;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  setPopupType: Dispatch<SetStateAction<PopupType>>;
  contentType: ContentType;
  setContentType: Dispatch<SetStateAction<ContentType>>;
}

export const RootContext = createContext<RootContextProps | null>(null);
