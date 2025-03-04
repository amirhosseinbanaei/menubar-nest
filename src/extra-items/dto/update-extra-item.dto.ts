import { PartialType } from '@nestjs/mapped-types';
import { CreateExtraItemDto } from './create-extra-item.dto';

export class UpdateExtraItemDto extends PartialType(CreateExtraItemDto) {}
