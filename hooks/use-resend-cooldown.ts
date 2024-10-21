import { getCookie, setCookie } from '@/lib/handlers/cookies';
import { useCallback, useEffect, useState } from 'react';

// Constants
const COOLDOWN_TIME = 120000; // 2 minutes in milliseconds
const LAST_RESEND_TIME_COOKIE = '__rc_last_started'; // Cookie key for the last resend time

/**
 * Custom hook to manage resend coolDown.
 * @returns {Object} - An object containing `canResend`, `timeLeft`, and `startCoolDown`.
 *
 * @example
 * const { canResend, timeLeft, formattedTimeLeft, startCoolDown } = useResendCoolDown();
 */
export const useResendCoolDown = () => {
  const [canResend, setCanResend] = useState<boolean>(true);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    // Check for an existing resend cooldown from cookies
    const lastResendTime = getCookie(LAST_RESEND_TIME_COOKIE);
    if (lastResendTime) {
      // Calculate elapsed time since last resend
      const elapsedTime = Date.now() - parseInt(lastResendTime, 10);
      if (elapsedTime < COOLDOWN_TIME) {
        setTimeLeft(COOLDOWN_TIME - elapsedTime);
        setCanResend(false);
      }
    }
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      // Set an interval to count down the remaining time
      const interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1000);
      }, 1000);

      // When countdown finishes, stop the interval and allow resending
      return () => clearInterval(interval);
    } else if (!canResend) {
      setCanResend(true);
    }
  }, [timeLeft, canResend]);

  // Handler to start the cooldown
  const startCoolDown = useCallback(() => {
    const now = Date.now();

    // Convert milliseconds to days
    const cookieDuration = COOLDOWN_TIME / (1000 * 60 * 60 * 24);
    setCookie(LAST_RESEND_TIME_COOKIE, now.toString(), cookieDuration);
    setTimeLeft(COOLDOWN_TIME);
    setCanResend(false);
  }, []);

  // Formats milliseconds into a "MM:SS" string
  const formatMilliseconds = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000); // Convert milliseconds to seconds
    const minutes = Math.floor(seconds / 60); // Calculate minutes
    const remainingSeconds = seconds % 60; // Calculate remaining seconds

    // Pad with leading zeros if necessary
    return `${String(minutes).padStart(2, '0')}:${String(
      remainingSeconds
    ).padStart(2, '0')}`;
  };

  // Return the current status, formatted countdown time, and the handler to start the cooldown
  return {
    canResend,
    timeLeft,
    formattedTimeLeft: timeLeft ? formatMilliseconds(timeLeft) : '00:00',
    startCoolDown,
  };
};
