import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SearchHistory } from 'entities/SearchHistory';
import { Repository } from 'typeorm';

@Injectable()
export class SearchHistoryService {
  constructor(
    @InjectRepository(SearchHistory)
    private searchHistoryRepository: Repository<SearchHistory>,
  ) {}
  async saveSearchHistory(keywords: string[], userId: string) {
    keywords.map(async (keyword) => {
      const addedSearchHistory = this.searchHistoryRepository.create({
        keyword,
        user: { id: userId },
      });
      await this.searchHistoryRepository.save(addedSearchHistory);
    });
    return {
      status: 'success',
      message: 'Search history saved successfully',
    };
  }
}
