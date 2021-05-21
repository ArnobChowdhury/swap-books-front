import { format } from 'date-fns';

export const formatMsgTimeStamp = (timestamp: number | string) => {
  const currentYear = new Date().getFullYear();
  const msgYear = new Date(timestamp).getFullYear();
  let pattern;
  if (currentYear === msgYear) {
    pattern = "MMM d', ' 'at' p";
  } else {
    pattern = "MMM d', ' yyyy 'at' p";
  }
  const time = new Date(timestamp);
  return format(time, pattern);
};
