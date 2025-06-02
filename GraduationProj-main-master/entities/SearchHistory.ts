import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';

@Entity()
export class SearchHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.searchHistories)
  user: User;

  @Column()
  keyword: string;

  @CreateDateColumn()
  searchedAt: Date;
}
