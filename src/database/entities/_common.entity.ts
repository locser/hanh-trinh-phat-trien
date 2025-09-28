import { ApiProperty } from '@nestjs/swagger';
import * as moment from 'moment-timezone';
import { Column } from 'typeorm';

export enum BOOLEAN {
  FALSE = 0,
  TRUE = 1,
}

export enum GENDER {
  FEMALE = 0,
  MALE = 1,
}

export enum MEDIA_TYPE {
  IMAGE = 1,
  VIDEO = 2,
  AUDIO = 3,
  FILE = 4,
}

export enum GOOGLE_APP_TYPE {
  WEB = 1,
  ANDROID = 2,
  IOS = 3,
}

export const DEFAULT_VALUE = {
  COMPANY_ID: 2000,
  THINKIC_COURSE_PWD: "TG2023@TTL",
  CONFIG_JWT_SECRET: "30586121265794fe1f819b4731a7419e4be35fca09d83c90e9e0c0e3d6207ced",
  HITA_DIAMOND_TOTAL_DAY: 365
}

export class CommonEntity {
  @ApiProperty({
    type: String,
    description: 'Thời gian tạo DD/MM/YYYY HH:mm',
    example: '01/01/2024 20:00',
  })
  @Column('datetime', {
    default: () => 'current_timestamp',
  })
  created_at: string;

  @ApiProperty({
    type: String,
    description: 'Thời gian cập nhật DD/MM/YYYY HH:mm',
    example: '01/01/2024 20:00',
  })
  @Column('datetime', {
    default: () => 'current_timestamp()',
    onUpdate: 'current_timestamp()',
  })
  updated_at: string;

  log_old_data: any;
  log_company_id: number = DEFAULT_VALUE.COMPANY_ID;
  log_user_id: number;

  protected mapResponse?(init?: CommonEntity) {
    this.log_user_id = undefined;
    this.log_company_id = undefined;
    this.log_old_data = undefined;
    this.created_at = init?.created_at ? moment(init.created_at, "YYYY-MM-DD HH:mm:ss").format('DD/MM/YYYY HH:mm') : '';
    this.updated_at = init?.updated_at ? moment(init.updated_at, "YYYY-MM-DD HH:mm:ss").format('DD/MM/YYYY HH:mm') : '';
  }
}


