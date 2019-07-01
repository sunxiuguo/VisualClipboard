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

        if (delay) {
            const timer = setInterval(tick, delay);
            return () => clearInterval(timer);
        }
    }, [delay]);
}
