import { useEffect, useState, MutableRefObject } from 'react';

export const useOnScreen = (
  childRef: MutableRefObject<any>,
  rootRef: MutableRefObject<any>,
  dependency: any[],
  cb?: () => void,
  executeOnce?: boolean,
) => {
  const [onScreen, setOnScreen] = useState<boolean>(false);

  useEffect(() => {
    let interesectionObserver: IntersectionObserver;
    if (childRef.current && rootRef.current) {
      interesectionObserver = new IntersectionObserver(
        ([entry], observer) => {
          if (entry.isIntersecting) {
            setOnScreen(true);
            if (cb) cb();
            if (executeOnce) {
              observer.unobserve(childRef.current);
            }
          } else {
            setOnScreen(false);
          }
        },
        { root: rootRef.current, threshold: 0.75 },
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
  }, [dependency]);

  return onScreen;
};
