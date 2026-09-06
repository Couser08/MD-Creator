import { useState, useEffect, useCallback } from 'react';

interface UseFocusSprintOptions {
  content: string;
  onSprintComplete?: (wordsWritten: number) => void;
}

export function useFocusSprint({ content, onSprintComplete }: UseFocusSprintOptions) {
  const [isSprintActive, setIsSprintActive] = useState(false);
  const [sprintDuration, setSprintDuration] = useState(25); // minutes
  const [sprintSecondsRemaining, setSprintSecondsRemaining] = useState(25 * 60);
  const [sprintStartWordCount, setSprintStartWordCount] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isSprintActive) {
      interval = setInterval(() => {
        setSprintSecondsRemaining((prev) => {
          if (prev <= 1) {
            setIsSprintActive(false);
            const currentWords = content.trim() ? content.trim().split(/\s+/).length : 0;
            const wordsWritten = Math.max(0, currentWords - sprintStartWordCount);
            if (onSprintComplete) {
              onSprintComplete(wordsWritten);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSprintActive, content, sprintStartWordCount, onSprintComplete]);

  const handleStartSprint = useCallback(
    (minutes?: number) => {
      const mins = minutes || sprintDuration;
      const currentWords = content.trim() ? content.trim().split(/\s+/).length : 0;
      setSprintDuration(mins);
      setSprintSecondsRemaining(mins * 60);
      setSprintStartWordCount(currentWords);
      setIsSprintActive(true);
    },
    [sprintDuration, content]
  );

  const handlePauseSprint = useCallback(() => {
    setIsSprintActive(false);
  }, []);

  const handleResetSprint = useCallback(() => {
    setIsSprintActive(false);
    setSprintSecondsRemaining(sprintDuration * 60);
  }, [sprintDuration]);

  const formatSprintTime = useCallback((seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }, []);

  return {
    isSprintActive,
    sprintDuration,
    sprintSecondsRemaining,
    sprintStartWordCount,
    handleStartSprint,
    handlePauseSprint,
    handleResetSprint,
    formatSprintTime,
  };
}
