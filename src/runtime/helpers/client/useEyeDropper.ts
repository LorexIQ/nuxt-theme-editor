const anySignal = (signals) => {
  // istanbul ignore next
  if ('any' in AbortSignal) return AbortSignal.any(signals);
  const controller = new AbortController();
  const onAbort = () => {
    controller.abort();
    for (const signal of signals) {
      signal.removeEventListener('abort', onAbort);
    }
  };
  for (const signal of signals) {
    if (signal.aborted) {
      onAbort();
      break;
    }
    signal.addEventListener('abort', onAbort);
  }
  return controller.signal;
};

const isSupported = () =>
  typeof window !== 'undefined' && 'EyeDropper' in window;

const resolveError = () => {
  let error = 'Unsupported browser.';
  // istanbul ignore next
  if (__isDev__) {
    error
      = 'Unsupported browser: no EyeDropper in Window. Check https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper_API.';
  }
  throw new Error(error);
};

const bindFunc = (key, instance) => {
  if (!instance) return resolveError;
  return EyeDropper.prototype[key].bind(instance);
};

/** @return {[unknown, () => boolean]} */
const useIsSupported = () => {
  const mounted = useRef();
  const [data, setData] = useState(false);
  useEffect(() => {
    mounted.current = true;
    setData(isSupported());
    return () => {
      mounted.current = false;
    };
  }, []);
  const supported = useCallback(() => data, [data]);
  return [mounted, supported];
};

/**
 * @param {EyeDropperProps} options
 */
export const useEyeDropper = (options) => {
  const openPicker = useMemo(() => {
    const dropper = isSupported() && new EyeDropper(options);
    const open = bindFunc('open', dropper);
    return open;
  }, [options]);
  const [mounted, isSupported] = useIsSupported();
  const controller = useRef();
  /** @type {() => void} */
  const close = useCallback(() => {
    if (typeof controller.current === 'undefined') return;
    controller.current.abort();
  }, [controller]);
  /** @type {(options?: ColorSelectionOptions) => Promise<ColorSelectionResult} */
  const open = useCallback(
    async (options = {}) => {
      close();
      const { signal, ...rest } = options;
      const newController = new AbortController();
      controller.current = newController;
      const unionSignal
        = typeof signal !== 'undefined'
          ? anySignal([signal, newController.signal])
          : newController.signal;
      try {
        const results = await openPicker({ ...rest, signal: unionSignal });
        return results;
      } catch (e) {
        if (!mounted.current) e.canceled = true;
        throw e;
      }
    },
    [controller, mounted, close, openPicker]
  );
  useEffect(() => close, [close]);
  return { open, close, isSupported };
};