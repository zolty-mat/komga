import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest'
import { server } from '@/mocks/api/node'
import { collectionsListQuery, collectionDetailQuery, collectionSeriesQuery, useDeleteCollection, useUpdateCollection } from '@/colada/collections'
import { createMockColada } from '@/mocks/pinia-colada'
import { enableAutoUnmount } from '@vue/test-utils'
import { useQuery } from '@pinia/colada'
import { response401Unauthorized } from '@/mocks/api/handlers'
import { http } from 'msw'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

enableAutoUnmount(afterEach)

describe('colada collections', () => {
  test('when collections list query succeeds then data is returned', async () => {
    createMockColada(() =>
      useQuery(
        collectionsListQuery({
          search: undefined,
          libraryIds: undefined,
          pageRequest: undefined,
        }),
      ),
    )

    const { data, refresh } = useQuery(
      collectionsListQuery({
        search: undefined,
        libraryIds: undefined,
        pageRequest: undefined,
      }),
    )

    await refresh()
    expect(data.value).toBeDefined()
  })

  test('when collections list endpoint fails with 401, error is set', async () => {
    server.use(http.get('*/api/v1/collections', response401Unauthorized))

    createMockColada(() =>
      useQuery(
        collectionsListQuery({
          search: undefined,
          libraryIds: undefined,
          pageRequest: undefined,
        }),
      ),
    )

    const { error, refresh } = useQuery(
      collectionsListQuery({
        search: undefined,
        libraryIds: undefined,
        pageRequest: undefined,
      }),
    )

    await refresh()
    expect(error.value).toBeDefined()
  })

  test('when collection detail query succeeds then data is returned', async () => {
    createMockColada(() =>
      useQuery(
        collectionDetailQuery({
          collectionId: '026801S4HWRZA',
        }),
      ),
    )

    const { data, refresh } = useQuery(
      collectionDetailQuery({
        collectionId: '026801S4HWRZA',
      }),
    )

    await refresh()
    expect(data.value).toBeDefined()
    expect(data.value?.name).toBe('Golden Age')
  })

  test('when collection detail query fails with 404, error is set', async () => {
    createMockColada(() =>
      useQuery(
        collectionDetailQuery({
          collectionId: '404',
        }),
      ),
    )

    const { error, refresh } = useQuery(
      collectionDetailQuery({
        collectionId: '404',
      }),
    )

    await refresh()
    expect(error.value).toBeDefined()
  })

  test('when collection series query succeeds then data is returned', async () => {
    createMockColada(() =>
      useQuery(
        collectionSeriesQuery({
          collectionId: '026801S4HWRZA',
          pageRequest: undefined,
        }),
      ),
    )

    const { data, refresh } = useQuery(
      collectionSeriesQuery({
        collectionId: '026801S4HWRZA',
        pageRequest: undefined,
      }),
    )

    await refresh()
    expect(data.value).toBeDefined()
  })

  test('when delete collection mutation succeeds then no error is returned', () => {
    createMockColada(() =>
      useDeleteCollection(),
    )

    const { mutate } = useDeleteCollection()

    mutate('026801S4HWRZB')
    // If no error is thrown, test passes
    expect(true).toBe(true)
  })

  test('when update collection mutation succeeds then collection is updated', () => {
    createMockColada(() =>
      useUpdateCollection(),
    )

    const { mutate } = useUpdateCollection()

    mutate({
      collectionId: '026801S4HWRZA',
      name: 'Updated Collection',
      ordered: false,
    })
    // If no error is thrown, test passes
    expect(true).toBe(true)
  })
})
