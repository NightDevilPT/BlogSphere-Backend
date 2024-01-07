// src/comments/entities/comment.entity.ts

import { BlogEntity } from 'src/blog/entities/blog.entity';
import { ProfileEntity } from 'src/profile/entities/profile.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('comments')
export class CommentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  comment: string;

  @ManyToOne(() => BlogEntity, blog => blog.comments)
  @JoinColumn()
  blog: BlogEntity;

  @ManyToOne(() => ProfileEntity, profile => profile.comments)
  @JoinColumn()
  profile: ProfileEntity;
}
