import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateCategory, CategoryAllDto, UpdateCategory } from './dto/create-doctor-category.dto';

@Injectable()
export class DoctorCategoryService {
  constructor(private prisma: PrismaService) {}

  // CREATE
  async create(createDto: CreateCategory, img?: string) {

    let oldCategory = await this.prisma.doctorCategory.findFirst({where:{name:createDto.name}})

    if(oldCategory) throw new NotFoundException(`Bu kategoriya avval yaratilgan`)

    return this.prisma.doctorCategory.create({
      data: {
        name: createDto.name,
        img: img || null,
      },
      include: {
        doctors: true, 
      },
    });
  }

  async findAll(filter?: CategoryAllDto) {
    const where: any = {};

    if (filter?.name) {
      where.name = { contains: filter.name, mode: 'insensitive' };
    }

    if (filter?.doctorId) {
      where.doctors = {
        some: { doctorId: filter.doctorId },
      };
    }

    return this.prisma.doctorCategory.findMany({
      where,
      skip: filter?.offset ?? 0,
      take: filter?.limit ?? 10,
      include: {
        doctors: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // FIND ONE
  async findOne(id: string) {
    const category = await this.prisma.doctorCategory.findUnique({
      where: { id },
      include: { doctors: true },
    });
    if (!category) {
      throw new NotFoundException(`DoctorCategory with id ${id} not found`);
    }
    return category;
  }

  // UPDATE
  async update(id: string, updateDto: UpdateCategory, img?: string) {
    const category = await this.prisma.doctorCategory.findUnique({ where: { id } });
    if (!category) throw new NotFoundException(`Bu kategoriya topilmadi`);

    if(updateDto.name){
      let oldCategory = await this.prisma.doctorCategory.findFirst({where:{name:updateDto.name}})
      if(oldCategory) throw new NotFoundException(`Bu kategoriya avval yaratilgan`)

    }



    return this.prisma.doctorCategory.update({
      where: { id },
      data: {
        name: updateDto.name ?? category.name,
        img: img ?? category.img,
      },
      include: { doctors: true },
    });
  }

  // REMOVE
  async remove(id: string) {
    const category = await this.prisma.doctorCategory.findUnique({ where: { id } });
    if (!category) throw new NotFoundException(`Bu kategoriya topilmadi`);

    return this.prisma.doctorCategory.delete({
      where: { id },
      include: { doctors: true },
    });
  }
}
