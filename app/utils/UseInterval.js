/**
 * react hooks - useInterval
 * https://overreacted.io/zh-hans/making-setinterval-declarative-with-react-hooks/
 */

import { useEffect, useRef } from 'react';

export default function useInterval(callback, delay) {
    const savedCallback = useRef();

    useEffect(() => {
        savedCallback.current = callback;
    });

    useEffect(() => {
        function tick() {
            savedCallback.current();
        }

        // 当delay === null时, 暂停interval
        if (delay !== null) {
            const timer = setInterval(tick, delay);
            return () => clearInterval(timer);
        }
    }, [delay]);
}
