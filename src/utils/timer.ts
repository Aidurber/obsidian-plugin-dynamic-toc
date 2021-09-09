/**
 * Creates a timer that when stopped will log the run time
 * @param message - Message to include in log
 * @returns
 */
export function createTimer(message: string) {
  let start: number | null = null;
  return {
    start: () => {
      start = new Date().getTime();
    },
    stop: () => {
      if (!start) return;
      console.log(
        `Dynamic TOC ${message} completed in ${new Date().getTime() - start}ms.`
      );
    },
  };
}
