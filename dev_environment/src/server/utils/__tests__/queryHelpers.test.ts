import {
  buildSearchQuery,
  parseCommaSeparatedArray,
  parsePaginationParams,
} from '../queryHelpers';

describe('queryHelpers', () => {
  describe('parseCommaSeparatedArray', () => {
    it('should return undefined for empty input', () => {
      expect(parseCommaSeparatedArray(undefined)).toBeUndefined();
      expect(parseCommaSeparatedArray('')).toBeUndefined();
    });

    it('should parse comma-separated values', () => {
      expect(parseCommaSeparatedArray('a,b,c')).toEqual(['a', 'b', 'c']);
    });

    it('should trim whitespace', () => {
      expect(parseCommaSeparatedArray(' a , b , c ')).toEqual(['a', 'b', 'c']);
    });

    it('should filter empty strings', () => {
      expect(parseCommaSeparatedArray('a,,b,  ,c')).toEqual(['a', 'b', 'c']);
    });
  });

  describe('parsePaginationParams', () => {
    it('should apply default values', () => {
      const result = parsePaginationParams({});

      expect(result).toEqual({
        page: 1,
        pageSize: 20,
        sortBy: 'created_at',
        sortOrder: 'desc',
      });
    });

    it('should use provided values', () => {
      const result = parsePaginationParams({
        page: 3,
        pageSize: 50,
        sortBy: 'title',
        sortOrder: 'asc',
      });

      expect(result).toEqual({
        page: 3,
        pageSize: 50,
        sortBy: 'title',
        sortOrder: 'asc',
      });
    });
  });

  describe('buildSearchQuery', () => {
    it('should combine all parameters', () => {
      const result = buildSearchQuery({
        q: 'test search',
        tags: 'urgent,bug',
        status: 'PLANNED,IN_PROGRESS',
        priority: 'HIGH',
        page: 2,
        pageSize: 30,
        sortBy: 'priority',
        sortOrder: 'asc',
      });

      expect(result).toEqual({
        q: 'test search',
        tags: ['urgent', 'bug'],
        status: ['PLANNED', 'IN_PROGRESS'],
        priority: ['HIGH'],
        pagination: {
          page: 2,
          pageSize: 30,
          sortBy: 'priority',
          sortOrder: 'asc',
        }
      });
    });

    it('should handle missing optional fields', () => {
      const result = buildSearchQuery({});

      expect(result).toEqual({
        q: undefined,
        tags: undefined,
        status: undefined,
        priority: undefined,
        pagination: {
          page: 1,
          pageSize: 20,
          sortBy: 'created_at',
          sortOrder: 'desc',
        }
      });
    });
  });
});
