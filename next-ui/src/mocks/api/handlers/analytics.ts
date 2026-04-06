import { httpTyped } from '@/mocks/api/httpTyped'
import { mockPage } from '@/mocks/api/pageable'
import { PageRequest } from '@/types/PageRequest'

// Mock book data with enhanced metadata for analytics
export const mockBooksWithMetadata = [
  {
    id: 'B1',
    name: 'Book 1',
    seriesId: 'S1',
    metadata: {
      title: 'The Great Adventure',
      authors: [{ name: 'Author One' }],
      genres: ['Fantasy', 'Adventure'],
      publisher: 'Fantasy Press',
      releaseDate: '2020-03-15',
      language: 'English',
    },
    readProgress: [{ completed: true, progress: 100 }],
  },
  {
    id: 'B2',
    name: 'Book 2',
    seriesId: 'S1',
    metadata: {
      title: 'The Mystery Unfolds',
      authors: [{ name: 'Author One' }],
      genres: ['Mystery', 'Thriller'],
      publisher: 'Mystery House',
      releaseDate: '2021-06-10',
      language: 'English',
    },
    readProgress: [{ completed: false, progress: 45 }],
  },
  {
    id: 'B3',
    name: 'Book 3',
    seriesId: 'S2',
    metadata: {
      title: 'Space Odyssey',
      authors: [{ name: 'Author Two' }],
      genres: ['Science Fiction', 'Adventure'],
      publisher: 'Sci-Fi Books',
      releaseDate: '2019-01-20',
      language: 'English',
    },
    readProgress: [{ completed: true, progress: 100 }],
  },
  {
    id: 'B4',
    name: 'Book 4',
    seriesId: 'S2',
    metadata: {
      title: 'The Lost Planet',
      authors: [{ name: 'Author Two' }],
      genres: ['Science Fiction'],
      publisher: 'Sci-Fi Books',
      releaseDate: '2020-05-12',
      language: 'English',
    },
    readProgress: [],
  },
  {
    id: 'B5',
    name: 'Book 5',
    seriesId: 'S3',
    metadata: {
      title: 'Romance in Paris',
      authors: [{ name: 'Author Three' }, { name: 'Author One' }],
      genres: ['Romance'],
      publisher: 'Romance Press',
      releaseDate: '2022-02-14',
      language: 'French',
    },
    readProgress: [{ completed: true, progress: 100 }],
  },
  {
    id: 'B6',
    name: 'Book 6',
    seriesId: 'S3',
    metadata: {
      title: 'Love in the City',
      authors: [{ name: 'Author Three' }],
      genres: ['Romance', 'Drama'],
      publisher: 'Romance Press',
      releaseDate: '2023-03-08',
      language: 'French',
    },
    readProgress: [{ completed: false, progress: 20 }],
  },
  {
    id: 'B7',
    name: 'Book 7',
    seriesId: 'S4',
    metadata: {
      title: 'History of Kings',
      authors: [{ name: 'Author Four' }],
      genres: ['History'],
      publisher: 'History House',
      releaseDate: '2018-07-04',
      language: 'English',
    },
    readProgress: [{ completed: true, progress: 100 }],
  },
  {
    id: 'B8',
    name: 'Book 8',
    seriesId: 'S4',
    metadata: {
      title: 'Medieval Times',
      authors: [{ name: 'Author Four' }],
      genres: ['History'],
      publisher: 'History House',
      releaseDate: '2019-09-15',
      language: 'English',
    },
    readProgress: [],
  },
  {
    id: 'B9',
    name: 'Book 9',
    seriesId: 'S5',
    metadata: {
      title: 'Comedy Night',
      authors: [{ name: 'Author Five' }],
      genres: ['Comedy', 'Drama'],
      publisher: 'Comedy Press',
      releaseDate: '2021-11-20',
      language: 'English',
    },
    readProgress: [{ completed: true, progress: 100 }],
  },
  {
    id: 'B10',
    name: 'Book 10',
    seriesId: 'S5',
    metadata: {
      title: 'The Last Laugh',
      authors: [{ name: 'Author Five' }],
      genres: ['Comedy'],
      publisher: 'Comedy Press',
      releaseDate: '2022-08-01',
      language: 'English',
    },
    readProgress: [{ completed: true, progress: 100 }],
  },
]

// Mock series data for analytics
export const mockSeriesForAnalytics = [
  {
    id: 'S1',
    name: 'Series One',
    booksCount: 2,
    booksReadCount: 1,
    lastModified: new Date('2024-02-15'),
  },
  {
    id: 'S2',
    name: 'Series Two',
    booksCount: 2,
    booksReadCount: 1,
    lastModified: new Date('2024-01-20'),
  },
  {
    id: 'S3',
    name: 'Series Three',
    booksCount: 2,
    booksReadCount: 1,
    lastModified: new Date('2024-03-10'),
  },
  {
    id: 'S4',
    name: 'Series Four',
    booksCount: 2,
    booksReadCount: 1,
    lastModified: new Date('2023-12-05'),
  },
  {
    id: 'S5',
    name: 'Series Five',
    booksCount: 2,
    booksReadCount: 2,
    lastModified: new Date('2024-04-01'),
  },
]

// Register MSW handlers for analytics endpoints
export const analyticsHandlers = [
  // POST /api/v1/series/list - Used by analytics queries
  httpTyped.post('*/api/v1/series/list', async ({ request, response, query }) => {
    const pageRequest = new PageRequest(
      Number(query.get('page') ?? '0'),
      Number(query.get('size') ?? '20'),
      query.getAll('sort'),
    )

    return response(200).json(mockPage(mockSeriesForAnalytics, pageRequest))
  }),

  // POST /api/v1/books/list - Used by analytics queries
  httpTyped.post('*/api/v1/books/list', async ({ request, response, query }) => {
    const pageRequest = new PageRequest(
      Number(query.get('page') ?? '0'),
      Number(query.get('size') ?? '20'),
      query.getAll('sort'),
    )

    return response(200).json(mockPage(mockBooksWithMetadata, pageRequest))
  }),
]
