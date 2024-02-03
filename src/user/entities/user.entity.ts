// src/user/entities/user.entity.ts
import { ProfileEntity } from 'src/profile/entities/profile.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  username: string;

  @Column({ type: 'varchar', length: 255, nullable:true })
  image: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable:true })
  password: string;

  @Column({ type: 'varchar', length: 255, default: 'local' })
  provider: string;

  @Column({ type: 'varchar', length: 255, nullable: true, default: null })
  token: string;

  @Column({ default: new Date().getTime() })
  createdAt: string;

  @Column({ default: new Date().getTime() })
  updatedAt: string;

  @OneToOne(() => ProfileEntity, profile => profile.user, { cascade: true })
  @JoinColumn()
  profile: ProfileEntity;

  @Column({ type: 'boolean', default: false })
  verified: boolean;
}
