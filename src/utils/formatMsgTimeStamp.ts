import { format } from 'date-fns';

export const formatMsgTimeStamp = (timestamp: number) => {
  const currentYear = new Date().getFullYear();
  const msgYear = new Date(timestamp).getFullYear();
  let pattern;
  if (currentYear === msgYear) {
    pattern = "MMM d', ' 'at' p";
  } else {
    pattern = "MMM d', ' yyyy 'at' p";
  }
  return format(timestamp, pattern);
};
