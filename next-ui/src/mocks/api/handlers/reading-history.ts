import { http, HttpResponse } from 'msw'

// Mock reading history endpoints
export const readingHistoryHandlers = [
  http.get('*/api/v1/series', ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '0')
    const size = parseInt(url.searchParams.get('size') || '20')

    // Generate mock series with reading progress
    const mockSeries = Array.from({ length: 50 }, (_, i) => ({
      id: `series-${i}`,
      metadata: {
        title: `Book ${i + 1}`,
        description: `A great read #${i + 1}`,
      },
      seriesTitle: `Series ${Math.floor(i / 5) + 1}`,
      booksCount: 10,
      readProgress: {
        page: Math.floor(Math.random() * 10),
        completed: Math.random() > 0.6,
        created: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        lastModified: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        deviceId: 'device-1',
        deviceName: 'Web Reader',
      },
    }))

    return HttpResponse.json({
      content: mockSeries.slice(page * size, (page + 1) * size),
      totalElements: 50,
      totalPages: Math.ceil(50 / size),
      pageNumber: page,
      pageSize: size,
      hasNextPage: page < Math.ceil(50 / size) - 1,
      hasPreviousPage: page > 0,
      isFirst: page === 0,
      isLast: page >= Math.ceil(50 / size) - 1,
    })
  }),

  http.patch('*/api/v1/books/:bookId/read-progress', async ({ params, request }) => {
    const body = (await request.json()) as Record<string, any> | null

    return HttpResponse.json({
      page: body?.page ?? 0,
      completed: body?.completed ?? false,
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      deviceId: 'device-1',
      deviceName: 'Web Reader',
    })
  }),

  http.delete('*/api/v1/books/:bookId/read-progress', () => {
    return HttpResponse.json(null, { status: 204 })
  }),
]
