import notificationsReducer from './notifications';
export default notificationsReducer;

import {
  NotificationState as _NotificationState,
  NotificationShape as _NotificationShape,
  NotificationResponseShape as _NotificationResponseShape,
  NotificationParticipantShape as _NotificationParticipantShape,
  NotificationShapeOnTheServer as _NotificationShapeOnTheServer,
} from './notifications';
export type NotificationState = _NotificationState;
export type NotificationShape = _NotificationShape;
export type NotificationResponseShape = _NotificationResponseShape;
export type NotificationParticipantShape = _NotificationParticipantShape;
export type NotificationShapeOnTheServer = _NotificationShapeOnTheServer;
