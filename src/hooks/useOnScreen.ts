import { useEffect, useState, MutableRefObject } from 'react';

export const useOnScreen = (
  childRef: MutableRefObject<any>,
  rootRef?: MutableRefObject<any>,
  dependency?: any[],
  cb?: () => void,
  executeOnce?: boolean,
) => {
  const [onScreen, setOnScreen] = useState<boolean>(false);

  useEffect(() => {
    let interesectionObserver: IntersectionObserver;
    if (childRef.current) {
      interesectionObserver = new IntersectionObserver(
        ([entry], observer) => {
          if (entry.isIntersecting) {
            setOnScreen(true);
            if (cb) {
              // @ts-ignore
              if (window.requestIdleCallback) {
                // @ts-ignore
                window.requestIdleCallback(cb);
              } else {
                cb();
              }
            }
            if (executeOnce) {
              observer.unobserve(childRef.current);
            }
          } else {
            setOnScreen(false);
          }
        },
        { root: rootRef && rootRef.current, threshold: 0.1 },
      );

      if (childRef.current) {
        interesectionObserver.observe(childRef.current);
      }
    }

    return () => {
      if (interesectionObserver) {
        interesectionObserver.disconnect();
      }
    };
  }, dependency && [dependency]);

  return onScreen;
};
