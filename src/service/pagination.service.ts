import { Injectable } from '@nestjs/common';

export interface PaginatedData {
  data: any;
  nextPage?: number;
  currentPage: number;
  limit: number;
  totalResults: number;
  totalPages: number;
}

@Injectable()
export class PaginationService {
  paginateData(data: any, page: number, limit: number): PaginatedData {
    if (page < 1) {
      page = 1; // If the page is negative, set it to 1
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedData = data.slice(startIndex, endIndex);

    const nextPage = page * limit < data.length ? Number(page) + 1 : null;
    const totalPages = Math.ceil(data.length / limit);

    return {
      data: paginatedData,
      nextPage,
      currentPage: Number(page),
      limit: Number(limit),
      totalResults: data.length,
      totalPages,
    };
  }
}
