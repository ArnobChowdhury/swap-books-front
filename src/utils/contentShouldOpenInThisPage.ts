import { ContentType } from 'contexts/RootContext';
import { MESSAGES_ROUTE, NOTIFICATIONS_ROUTE } from 'frontEndRoutes';

export const contentShouldOpenInThisPage = (
  route: string,
  contentType: ContentType,
) => {
  if (contentType === 'Messages' && route === MESSAGES_ROUTE) {
    return false;
  } else if (contentType === 'Notifications' && route === NOTIFICATIONS_ROUTE) {
    return false;
  } else {
    return true;
  }
};
