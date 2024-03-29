import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from 'src/profile/entities/profile.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { BlogEntity } from './entities/blog.entity';
import { PaginationService } from 'src/service/pagination.service';

interface filterType {
  title?:string;
  tags?:string[];
  profileName?:string;
  sortBy?:string;
}

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    @InjectRepository(BlogEntity)
    private readonly blogEntity: Repository<BlogEntity>,
    private paginationService: PaginationService,
  ) {}

  async create(createBlogDto: any, id: any) {
    const findProfile = await this.profileRepository.findOne({
      where: { user: { id: id } },
      select: ['id'],
    });
    if (!findProfile) {
      return new NotFoundException('NotFound : Profile Not Found');
    }
    const newBlog = {
      ...createBlogDto,
      profile: { id: findProfile?.id },
    };
    const createBlog = await this.blogEntity.create(newBlog);
    const saveBlog = await this.blogEntity.save(createBlog);
    return {
      message: 'Profile Successfully created',
      status: 200,
      data: saveBlog,
    };
  }

  async findAll(page: number, limit: number, filter: filterType) {
    const {tags,title,profileName,sortBy} = filter;
    let queryBuilder = this.blogEntity
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.profile', 'profile')
      .leftJoinAndSelect('profile.user', 'user');

    if (title && title.length > 0) {
      queryBuilder = queryBuilder.andWhere(`blog.title LIKE :title`, {
        title: `%${title}%`,
      });
    }

    if (tags && tags.length > 0) {
      const tagsArray = Array.isArray(tags) ? tags : [tags];
      queryBuilder = queryBuilder.andWhere(`blog.tags && :tags`, {
        tags: tagsArray,
      });
    }

    if (profileName && profileName.length > 0) {
      queryBuilder = queryBuilder.andWhere(`profile.firstname LIKE :profileName`, {
        profileName: `%${profileName}%`,
      });
    }

    if (sortBy && sortBy.length > 0) {
      switch (sortBy) {
        case 'date':
          queryBuilder = queryBuilder.orderBy('blog.createdAt', 'DESC');
          break;
        case 'title':
          queryBuilder = queryBuilder.orderBy('blog.title', 'ASC');
          break;
        default:
          queryBuilder = queryBuilder.orderBy('blog.title', 'ASC');
          break;
      }
    }

    const allBlogs = await queryBuilder.getMany();

    const modifiedBlogs = allBlogs.map((blog: BlogEntity) => {
      return { ...blog, profile: this.modifyProfile(blog.profile) };
    });

    return this.paginationService.paginateData(modifiedBlogs, page, limit);
  }

  async findOne(id: string) {
    const findBlog = await this.blogEntity.findOne({
      where: { id },
      relations: ['profile'],
    });
    const properBlogData = {
      ...findBlog,
      profile: this.modifyProfile(findBlog.profile),
    };
    return properBlogData;
  }

  async update(id: string, updateBlogDto: any) {
    const findBlog = await this.blogEntity.findOne({ where: { id } });
    console.log(findBlog);
    if (!findBlog) {
      return new NotFoundException('Not Found : Blog Not Found');
    }
    const newUpdatedBlog = { ...findBlog, ...updateBlogDto };
    const updatedBlog = await this.blogEntity.update(id, newUpdatedBlog);
    return {
      message: 'blog successfully updated',
      success: true,
      error: false,
    };
  }

  async remove(id: string, userId: string) {
    const findBlog = await this.blogEntity.findOne({
      where: {
        id,
        profile: {
          user: {
            id: userId,
          },
        },
      },
    });
    if (!findBlog) return new NotFoundException('Not Found : Blog Not Found');
    const deleteBlog = await this.blogEntity.delete(id);
    return {
      message: 'Blog successfully deleted',
      success: true,
      error: false,
    };
  }

  modifyProfile(profileData: ProfileEntity | ProfileEntity[]) {
    if (
      Array.isArray(profileData) &&
      profileData.length > 0 &&
      typeof profileData[0] === 'object'
    ) {
      profileData.map((profiles: ProfileEntity) => {
        if (profiles.user) {
          profiles.user = {
            id: profiles.user.id,
            username: profiles.user.username,
            email: profiles.user.email,
            createdAt: profiles.user.createdAt,
            updatedAt: profiles.user.updatedAt,
            verified: profiles.user.verified,
          } as UserEntity;
        }
      });
    } else if (
      typeof profileData === 'object' &&
      profileData !== null &&
      !Array.isArray(profileData)
    ) {
      profileData.user = {
        id: profileData.user.id,
        username: profileData.user.username,
        email: profileData.user.email,
        createdAt: profileData.user.createdAt,
        updatedAt: profileData.user.updatedAt,
        verified: profileData.user.verified,
      } as UserEntity;
    }
    return profileData;
  }
}
