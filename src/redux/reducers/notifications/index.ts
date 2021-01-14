import notificationsReducer from './notifications';
export default notificationsReducer;

import {
  NotificationState as _NotificationState,
  NotificationShape as _NotificationShape,
  NotificationResponseShape as _NotificationResponseShape,
} from './notifications';
export type NotificationState = _NotificationState;
export type NotificationShape = _NotificationShape;
export type NotificationResponseShape = _NotificationResponseShape;
