export function memoryUsage(): { [key: string]: number } {
  const used = process.memoryUsage();
  const usageInfo: { [key: string]: number } = {};

  for (let key in used) {
    // @ts-ignore
    usageInfo[key] = Math.round((used[key] / 1024 / 1024) * 100) / 100;
  }

  return usageInfo;
}
