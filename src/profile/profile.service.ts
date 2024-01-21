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

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
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
      console.log('========', err.message, err.code, '??????');
      throw new BadRequestException(err.message);
    }
  }

  async findAll() {
    try{
      const allUsers = await this.profileRepository.find()
      return allUsers
    }catch(error){
      throw new BadRequestException(error.message)
    }
  }

  async getProfileByIdWithUser(
    profileId: string,
  ): Promise<ProfileEntity | any> {
    try {
      const profileData = await this.profileRepository.findOne({where: {id: profileId}});
      if(profileData.user){
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
}
