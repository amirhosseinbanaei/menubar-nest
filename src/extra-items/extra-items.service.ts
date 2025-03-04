import { Injectable } from '@nestjs/common';
import { CreateExtraItemDto } from './dto/create-extra-item.dto';
import { UpdateExtraItemDto } from './dto/update-extra-item.dto';

@Injectable()
export class ExtraItemsService {
  create(createExtraItemDto: CreateExtraItemDto) {
    return 'This action adds a new extraItem';
  }

  findAll() {
    return `This action returns all extraItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} extraItem`;
  }

  update(id: number, updateExtraItemDto: UpdateExtraItemDto) {
    return `This action updates a #${id} extraItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} extraItem`;
  }
}
