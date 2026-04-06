import { describe, expect, test, vi } from 'vitest'
import { combinePromises } from '@/colada/utils'

describe('combinePromises', () => {
  test('calls secondary promises before main', async () => {
    const callOrder: string[] = []

    const main = vi.fn(async () => {
      callOrder.push('main')
    })
    const secondary1 = vi.fn(async () => {
      callOrder.push('secondary1')
    })
    const secondary2 = vi.fn(async () => {
      callOrder.push('secondary2')
    })

    const combined = combinePromises(main, [secondary1, secondary2])
    await combined()

    expect(secondary1).toHaveBeenCalledOnce()
    expect(secondary2).toHaveBeenCalledOnce()
    expect(main).toHaveBeenCalledOnce()
    // main should be called after secondaries settle
    expect(callOrder.indexOf('main')).toBeGreaterThan(0)
  })

  test('passes throwOnError to main', async () => {
    const main = vi.fn(async (_throwOnError: boolean) => {})
    const combined = combinePromises(main, [])

    await combined(true)
    expect(main).toHaveBeenCalledWith(true)

    await combined(false)
    expect(main).toHaveBeenCalledWith(false)
  })

  test('defaults throwOnError to false', async () => {
    const main = vi.fn(async (_throwOnError: boolean) => {})
    const combined = combinePromises(main, [])

    await combined()
    expect(main).toHaveBeenCalledWith(false)
  })

  test('continues even if secondary rejects', async () => {
    const main = vi.fn(async () => 'ok')
    const failingSecondary = vi.fn(async () => {
      throw new Error('secondary failed')
    })

    const combined = combinePromises(main, [failingSecondary])
    await combined()

    expect(failingSecondary).toHaveBeenCalledOnce()
    expect(main).toHaveBeenCalledOnce()
  })
})
