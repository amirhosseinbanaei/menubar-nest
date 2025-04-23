import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Tag } from './tag.entity';
import { Language } from '../../languages/entities/language.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class TagTranslation {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column()
  description: string;

  @ManyToOne(() => Tag, (tag) => tag.translations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tag_id' })
  tag: Tag;

  @ManyToOne(() => Language, (language) => language.tagTranslations, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'language' })
  language: Language;
}
