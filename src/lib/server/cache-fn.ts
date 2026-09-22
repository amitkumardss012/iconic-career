import { createServerFn } from "@tanstack/react-start"
import { serverCache } from "@/lib/server/cache"

/**
 * Server function to retrieve real-time cache analytics & metrics
 */
export const getCacheMetricsFn = createServerFn({ method: "GET" }).handler(async () => {
  return serverCache.getMetrics()
})

/**
 * Server function to flush/clear the entire server-side cache
 */
export const flushCacheFn = createServerFn({ method: "POST" }).handler(async () => {
  serverCache.clear()
  return { success: true, message: "Server cache cleared successfully." }
})
