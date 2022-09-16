export const sleep = (durationSeconds: number) => 
  new Promise(resolve =>
    setTimeout(resolve, durationSeconds * 1000)
  );