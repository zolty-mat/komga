import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest'
import { server } from '@/mocks/api/node'
import { authorsQuery, genresQuery, tagsQuery, publishersQuery } from '@/colada/referential'
import { createMockColada } from '@/mocks/pinia-colada'
import { enableAutoUnmount } from '@vue/test-utils'
import { useQuery } from '@pinia/colada'
import { response401Unauthorized } from '@/mocks/api/handlers'
import { http } from 'msw'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

enableAutoUnmount(afterEach)

describe('colada referential', () => {
  test('when authors query succeeds then data is returned', async () => {
    createMockColada(() =>
      useQuery(
        authorsQuery({
          search: undefined,
          role: undefined,
          library_id: undefined,
          collection_id: undefined,
          series_id: undefined,
          readlist_id: undefined,
          pageRequest: undefined,
        }),
      ),
    )

    const { data, refresh } = useQuery(
      authorsQuery({
        search: undefined,
        role: undefined,
        library_id: undefined,
        collection_id: undefined,
        series_id: undefined,
        readlist_id: undefined,
        pageRequest: undefined,
      }),
    )

    await refresh()
    expect(data.value).toBeDefined()
  })

  test('when authors endpoint fails with 401, error is set', async () => {
    server.use(http.get('*/api/v2/authors', response401Unauthorized))

    createMockColada(() =>
      useQuery(
        authorsQuery({
          search: undefined,
          role: undefined,
          library_id: undefined,
          collection_id: undefined,
          series_id: undefined,
          readlist_id: undefined,
          pageRequest: undefined,
        }),
      ),
    )

    const { error, refresh } = useQuery(
      authorsQuery({
        search: undefined,
        role: undefined,
        library_id: undefined,
        collection_id: undefined,
        series_id: undefined,
        readlist_id: undefined,
        pageRequest: undefined,
      }),
    )

    await refresh()
    expect(error.value).toBeDefined()
  })

  test('when genres query succeeds then data is returned', async () => {
    createMockColada(() =>
      useQuery(
        genresQuery({
          search: undefined,
          library_id: undefined,
          collection_id: undefined,
          pageRequest: undefined,
        }),
      ),
    )

    const { data, refresh } = useQuery(
      genresQuery({
        search: undefined,
        library_id: undefined,
        collection_id: undefined,
        pageRequest: undefined,
      }),
    )

    await refresh()
    expect(data.value).toBeDefined()
  })

  test('when tags query succeeds then data is returned', async () => {
    createMockColada(() =>
      useQuery(
        tagsQuery({
          search: undefined,
          library_id: undefined,
          collection_id: undefined,
          series_id: undefined,
          readlist_id: undefined,
          include: undefined,
          pageRequest: undefined,
        }),
      ),
    )

    const { data, refresh } = useQuery(
      tagsQuery({
        search: undefined,
        library_id: undefined,
        collection_id: undefined,
        series_id: undefined,
        readlist_id: undefined,
        include: undefined,
        pageRequest: undefined,
      }),
    )

    await refresh()
    expect(data.value).toBeDefined()
  })

  test('when publishers query succeeds then data is returned', async () => {
    createMockColada(() =>
      useQuery(
        publishersQuery({
          search: undefined,
          library_id: undefined,
          collection_id: undefined,
          pageRequest: undefined,
        }),
      ),
    )

    const { data, refresh } = useQuery(
      publishersQuery({
        search: undefined,
        library_id: undefined,
        collection_id: undefined,
        pageRequest: undefined,
      }),
    )

    await refresh()
    expect(data.value).toBeDefined()
  })
})
