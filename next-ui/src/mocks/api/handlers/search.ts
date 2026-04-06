import { httpTyped } from '@/mocks/api/httpTyped'
import { HttpResponse } from 'msw'
import { mockPage } from '@/mocks/api/pageable'
import { mockSeries1 } from '@/mocks/api/handlers/series'
import { mockBook } from '@/mocks/api/handlers/books'

// Mock author for search results
export const mockAuthor1 = {
  id: '1',
  name: 'Akira Toriyama',
  description: 'Legendary manga artist known for Dragon Ball and Dr. Slump',
}

export const mockAuthor2 = {
  id: '2',
  name: 'Eiichiro Oda',
  description: 'Creator of the famous manga series One Piece',
}

export const searchSeriesHandler = httpTyped.post('/api/v1/series/list', async ({ request }) => {
  return HttpResponse.json(
    mockPage({
      content: [mockSeries1],
    }),
  )
})

export const searchBooksHandler = httpTyped.post('/api/v1/books/list', async ({ request }) => {
  return HttpResponse.json(
    mockPage({
      content: [mockBook],
    }),
  )
})

export const searchAuthorsHandler = httpTyped.get('/api/v2/authors', () => {
  return HttpResponse.json(
    mockPage({
      content: [mockAuthor1, mockAuthor2],
    }),
  )
})

export const searchHandlers = [searchSeriesHandler, searchBooksHandler, searchAuthorsHandler]
