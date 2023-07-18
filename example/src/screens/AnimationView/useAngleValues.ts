import { useEffect } from 'react';
import { Observable } from 'rxjs';
import { useAtomValue } from 'jotai';
import { angleValuesAtom } from '../../state';

export const useAngleValues = (updateAngle: (value: number) => void) => {
  const values = useAtomValue(angleValuesAtom);

  useEffect(() => {
    const array = new Observable<number>(function (observer) {
      const valueArray = values;
      if (!valueArray || !valueArray.length) return;

      let i = 0;
      const interval = setInterval(() => {
        if (i < valueArray.length) {
          const value = valueArray[i];
          if (value) {
            observer.next(parseInt(value.toString(), 10));
            i++;
          }
        } else {
          clearInterval(interval);
        }
      }, 100);
    });

    array.subscribe((observer) => updateAngle(observer));
  }, [updateAngle, values]);
};
