import { Injectable } from '@nestjs/common';
import { CreateDoctorProfileDto } from './dto/create-doctor-profile.dto';
import { UpdateDoctorProfileDto } from './dto/update-doctor-profile.dto';

@Injectable()
export class DoctorProfileService {
  create(createDoctorProfileDto: CreateDoctorProfileDto) {
    return 'This action adds a new doctorProfile';
  }

  findAll() {
    return `This action returns all doctorProfile`;
  }

  findOne(id: number) {
    return `This action returns a #${id} doctorProfile`;
  }

  update(id: number, updateDoctorProfileDto: UpdateDoctorProfileDto) {
    return `This action updates a #${id} doctorProfile`;
  }

  remove(id: number) {
    return `This action removes a #${id} doctorProfile`;
  }
}
