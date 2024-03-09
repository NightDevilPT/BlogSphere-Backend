// src/profile/entities/profile.entity.ts

import { BlogEntity } from 'src/blog/entities/blog.entity';
import { CommentEntity } from 'src/comment/entities/comment.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity('profiles')
export class ProfileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  firstname: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lastname: string;

  @Column({ type: 'enum', enum: ['male', 'female', 'other'], nullable: true })
  gender: string;

  @Column({ type: 'varchar', length: 255, default: null })
  bio: string;

  @Column({ type: 'varchar', length: 255, default: null })
  image: string;

  @Column({ type: 'varchar', length: 255, default: null })
  facebook: string;

  @Column({ type: 'varchar', length: 255, default: null })
  twitter: string;

  @Column({ type: 'varchar', length: 255, default: null })
  instagram: string;

  @Column({ type: 'varchar', length: 255, default: null })
  youtube: string;

  @Column({ default: new Date().getTime() })
  createdAt: string;

  @Column({ default: new Date().getTime() })
  updatedAt: string;

  @OneToOne(() => UserEntity, (user) => user.profile, {
    cascade: ['insert', 'update'],
    eager: true,
  })
  @JoinColumn()
  user: UserEntity;

  @OneToMany(() => BlogEntity, (blog) => blog.profile, { cascade: true })
  blogs: BlogEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.profile, {
    cascade: true,
  })
  comments: CommentEntity[];
}
