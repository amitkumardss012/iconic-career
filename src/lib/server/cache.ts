/**
 * Production-Ready In-Memory Server-Side Cache Layer
 * Features:
 * - TTL (Time-To-Live) expiration
 * - Tag-based atomic invalidation (e.g. invalidate all "students" query variants at once)
 * - Observability metrics (hit count, miss count, hit ratio)
 * - Structured console logging for developer visibility
 */

interface CacheEntry<T> {
  data: T
  expiresAt: number
  tags: string[]
  createdAt: number
}

export interface CacheMetrics {
  hits: number
  misses: number
  totalRequests: number
  hitRatio: string
  size: number
  keys: string[]
}

class ServerCache {
  private store = new Map<string, CacheEntry<unknown>>()
  private hits = 0
  private misses = 0

  /**
   * Get an item from the cache or compute/fetch it from DB and cache it
   */
  async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    options: { ttlSeconds?: number; tags?: string[] } = {}
  ): Promise<T> {
    const { ttlSeconds = 60, tags = [] } = options
    const now = Date.now()

    const cached = this.store.get(key)
    if (cached && cached.expiresAt > now) {
      this.hits++
      if (process.env.NODE_ENV !== "production") {
        console.log(`⚡ [CACHE HIT] "${key}" (TTL: ${Math.round((cached.expiresAt - now) / 1000)}s remaining)`)
      }
      return cached.data as T
    }

    this.misses++
    const startFetch = Date.now()
    if (process.env.NODE_ENV !== "production") {
      console.log(`⏳ [CACHE MISS] "${key}" -> executing database query...`)
    }

    // Execute query
    const freshData = await fetchFn()
    const duration = Date.now() - startFetch

    // Store in cache
    this.store.set(key, {
      data: freshData,
      expiresAt: now + ttlSeconds * 1000,
      tags,
      createdAt: now,
    })

    if (process.env.NODE_ENV !== "production") {
      console.log(`💾 [CACHE STORED] "${key}" (${duration}ms, TTL: ${ttlSeconds}s, tags: [${tags.join(", ")}])`)
    }

    return freshData
  }

  /**
   * Invalidate specific keys or all keys associated with any given tag
   */
  invalidateTags(tags: string[]): number {
    const targetTags = new Set(tags)
    let evictedCount = 0

    for (const [key, entry] of this.store.entries()) {
      if (entry.tags.some((t) => targetTags.has(t))) {
        this.store.delete(key)
        evictedCount++
      }
    }

    if (process.env.NODE_ENV !== "production" && evictedCount > 0) {
      console.log(`🧹 [CACHE INVALIDATED] Tags: [${tags.join(", ")}] -> Evicted ${evictedCount} cache entries`)
    }

    return evictedCount
  }

  /**
   * Invalidate a specific cache key
   */
  invalidateKey(key: string): boolean {
    const deleted = this.store.delete(key)
    if (deleted && process.env.NODE_ENV !== "production") {
      console.log(`🧹 [CACHE EVICTED KEY] "${key}"`)
    }
    return deleted
  }

  /**
   * Clear entire cache
   */
  clear(): void {
    const count = this.store.size
    this.store.clear()
    this.hits = 0
    this.misses = 0
    if (process.env.NODE_ENV !== "production") {
      console.log(`🧹 [CACHE FLUSHED] Cleared all ${count} entries.`)
    }
  }

  /**
   * Retrieve real-time cache analytics
   */
  getMetrics(): CacheMetrics {
    const total = this.hits + this.misses
    const ratio = total > 0 ? `${((this.hits / total) * 100).toFixed(1)}%` : "0%"

    return {
      hits: this.hits,
      misses: this.misses,
      totalRequests: total,
      hitRatio: ratio,
      size: this.store.size,
      keys: Array.from(this.store.keys()),
    }
  }
}

// Global singleton to preserve cache across requests in development and production
const globalForCache = globalThis as unknown as { serverCache: ServerCache | undefined }
export const serverCache = globalForCache.serverCache ?? new ServerCache()

if (process.env.NODE_ENV !== "production") {
  globalForCache.serverCache = serverCache
}
