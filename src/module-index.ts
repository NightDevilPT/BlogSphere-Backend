import { BlogEntity } from './blog/entities/blog.entity';
import { CommentEntity } from './comment/entities/comment.entity';
import { ProfileEntity } from './profile/entities/profile.entity';
import { UserEntity } from './user/entities/user.entity';

export const AllEntities = [UserEntity, ProfileEntity, BlogEntity, CommentEntity];
