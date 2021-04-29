import * as Yup from 'yup';

export const updateUserLocationSchema = Yup.object({
  userLon: Yup.number().required('Need userLon.'),
  userLat: Yup.number().required('Need userLat.'),
});
//setNotificationAsSeen

export const setNotificationAsSeenSchema = Yup.object({
  notificationId: Yup.string().required('Need Notification Id.'),
});
