export const plans = {
  FREE: { bots: 1, memoryMb: 256, cpu: 0.25, price: 0 },
  STARTER: { bots: 3, memoryMb: 512, cpu: 0.5, price: 19 },
  PRO: { bots: 10, memoryMb: 1024, cpu: 1, price: 49 },
  SCALE: { bots: 40, memoryMb: 4096, cpu: 4, price: 149 },
  ENTERPRISE: { bots: 999, memoryMb: 16384, cpu: 16, price: null },
} as const;
