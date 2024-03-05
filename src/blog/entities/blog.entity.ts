// src/blog/entities/blog.entity.ts

import { CommentEntity } from 'src/comment/entities/comment.entity';
import { ProfileEntity } from 'src/profile/entities/profile.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity('blogs')
export class BlogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255 })
  image: string;

  @Column({ type: 'varchar', length: 255, array: true })
  tags: string[];

  @Column({ type: 'text', nullable: true })
  data: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => ProfileEntity, (profile) => profile.blogs)
  @JoinColumn()
  profile: ProfileEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.blog, { cascade: true })
  @JoinColumn()
  comments: CommentEntity[];
}
