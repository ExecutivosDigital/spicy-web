"use client";
import { usePathname, useRouter } from "next/navigation";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface LoadingContextProps {
  isNavigating: boolean;
  handleNavigation: (path: string) => void;
  delay: boolean;
  setDelay: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoadingContext = createContext<LoadingContextProps | undefined>(
  undefined,
);

interface ProviderProps {
  children: ReactNode;
}

export const LoadingContextProvider = ({ children }: ProviderProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const [delay, setDelay] = useState(false);
  const [isNavigating, setIsNavigating] = useState(true);

  const navigationStartTime = useRef<number>(0);
  const lastTargetPathRef = useRef<string | null>(null);
  const prevPathnameRef = useRef<string | null>(null);

  // Two timers: one to enforce the minimum, one as a watchdog ceiling
  const settleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ceilingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const MIN_LOADING_MS = 1000; // minimum overlay time
  const CEILING_MS = 5000; // hard ceiling to prevent sticky loader when data never arrives

  const isPublicRoute = (path: string) =>
    ["/login", "/register", "/forgot-password"].includes(path);

  const clearSettleTimer = () => {
    if (settleTimeoutRef.current) {
      clearTimeout(settleTimeoutRef.current);
      settleTimeoutRef.current = null;
    }
  };

  const clearCeilingTimer = () => {
    if (ceilingTimeoutRef.current) {
      clearTimeout(ceilingTimeoutRef.current);
      ceilingTimeoutRef.current = null;
    }
  };

  const clearAllTimers = () => {
    clearSettleTimer();
    clearCeilingTimer();
  };

  const ensureStartTime = () => {
    if (navigationStartTime.current === 0) {
      navigationStartTime.current = Date.now();
    }
  };

  const scheduleSettleAfterMin = () => {
    ensureStartTime();
    const elapsed = Date.now() - navigationStartTime.current;
    const remaining = Math.max(0, MIN_LOADING_MS - elapsed);
    clearSettleTimer();
    settleTimeoutRef.current = setTimeout(() => {
      setIsNavigating(false);
      lastTargetPathRef.current = null;
      navigationStartTime.current = 0;
      clearCeilingTimer();
    }, remaining);
  };

  const scheduleCeilingWatchdog = () => {
    // Only create a watchdog if one doesn't already exist
    if (ceilingTimeoutRef.current) return;
    ceilingTimeoutRef.current = setTimeout(() => {
      // Force-finish to avoid sticky loader. We don't change the route here.
      setIsNavigating(false);
      lastTargetPathRef.current = null;
      navigationStartTime.current = 0;
      clearSettleTimer();
    }, CEILING_MS);
  };

  const startNavigation = (targetPath: string | null) => {
    // No-op if already navigating to the same target
    if (
      isNavigating &&
      targetPath &&
      lastTargetPathRef.current === targetPath
    ) {
      return;
    }
    setDelay(true);
    clearAllTimers();
    setIsNavigating(true);
    navigationStartTime.current = Date.now();
    lastTargetPathRef.current = targetPath;
    // Always arm a watchdog in case data/guards lag
    scheduleCeilingWatchdog();
  };

  const handleNavigation = (path: string) => {
    if (pathname === path) return;
    startNavigation(path);
    router.push(path);
  };

  // Start loader on first render (F5 / hard refresh)
  useEffect(() => {
    startNavigation(pathname);
    // Snapshot current path so the next effect doesn't treat mount as a change
    prevPathnameRef.current = pathname;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Detect navigation (including those not triggered via handleNavigation)
  useEffect(() => {
    if (prevPathnameRef.current === null) {
      // first mount snapshot (should be set by the mount effect, but keep as guard)
      prevPathnameRef.current = pathname;
    } else if (prevPathnameRef.current !== pathname) {
      // Path actually changed; treat as a new navigation arrival
      startNavigation(pathname);
      prevPathnameRef.current = pathname;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Single coordinator effect: decides when to settle the loader
  useEffect(() => {
    if (!isNavigating) return;

    // PUBLIC: settle after minimum regardless of userProfile
    if (isPublicRoute(pathname)) {
      scheduleSettleAfterMin();
      return;
    }

    // Access OK → settle respecting the minimum
    scheduleSettleAfterMin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNavigating, pathname]);

  // Clear timers on unmount only
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, []);

  return (
    <LoadingContext.Provider
      value={{ isNavigating, handleNavigation, delay, setDelay }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

export function useLoadingContext() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error(
      "useLoadingContext deve ser usado dentro de um LoadingContextProvider",
    );
  }
  return context;
}
