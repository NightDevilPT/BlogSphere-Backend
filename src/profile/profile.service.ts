import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProfileCreateDTO } from './dto/profile-create.dto';
import { ProfileEntity } from './entities/profile.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { PaginationService } from 'src/service/pagination.service';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    private paginationService: PaginationService
  ) { }

  async create(
    createProfileDto: ProfileCreateDTO,
    id: string,
  ): Promise<ProfileCreateDTO> {
    try {
      const newProfileData = {
        ...createProfileDto,
        user: { id },
      };
      const newProfile = await this.profileRepository.create(newProfileData);
      const createdProfile = await this.profileRepository.save(newProfile);
      return createdProfile;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async findAll(page:number,limit:number) {
    try{
      const allUsers = await this.profileRepository.find()
      const modifiedArray = this.modifyProfile(allUsers)
      return this.paginationService.paginateData(modifiedArray,page,limit);
    }catch(error){
      throw new BadRequestException(error.message)
    }
  }

  async getProfileByIdWithUser(
    profileId: string,
  ): Promise<ProfileEntity | any> {
    try {
      const profileData = await this.profileRepository.findOne({where: {id: profileId}});
      this.modifyProfile(profileData);
      if(profileData.user){
        this.modifyProfile(profileData);
      }
      return profileData
    } catch (error) {
      if (error.name === 'EntityNotFound') {
        throw new NotFoundException('Profile not found');
      }
      throw error;
    }
  }

  async update(id: string, updateProfileDto: any) {
    try{
      console.log(id)
      const findAndUpdate = await this.profileRepository.update(id,updateProfileDto)
      if(findAndUpdate){
        return {message:'profile successfully updated',success:true,error:false}
      }

      throw new NotFoundException('profile not found')
    }catch(error){
      throw new BadRequestException(error.message)
    }
  }

  modifyProfile(profileData:ProfileEntity | ProfileEntity[]){
    // if(profileData)
    if (Array.isArray(profileData) && profileData.length > 0 && typeof profileData[0] === 'object') {
      profileData.map((profiles:ProfileEntity)=>{
        if(profiles.user){
          profiles.user = {
            id: profiles.user.id,
            username: profiles.user.username,
            email: profiles.user.email,
            createdAt: profiles.user.createdAt,
            updatedAt: profiles.user.updatedAt,
            verified: profiles.user.verified,
          } as UserEntity;
        }
      })
    } else if (typeof profileData === 'object' && profileData !== null && !Array.isArray(profileData)) {
      profileData.user = {
        id: profileData.user.id,
        username: profileData.user.username,
        email: profileData.user.email,
        createdAt: profileData.user.createdAt,
        updatedAt: profileData.user.updatedAt,
        verified: profileData.user.verified,
      } as UserEntity;
    }
    return profileData
  }
}
