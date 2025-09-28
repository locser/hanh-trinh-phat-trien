import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

interface IBaseResponse {
  status?: HttpStatus;
  message?: string;
  data?: unknown;
}

export class BaseResponse {
  @ApiProperty({
    type: Number,
    example: HttpStatus.OK,
  })
  status: HttpStatus;

  @ApiProperty({
    type: String,
    example: 'OK',
  })
  message: string;

  data: any;

  constructor(init?: IBaseResponse) {
    this.status = init?.status || HttpStatus.OK;
    this.message = init?.message || 'OK';
    this.data = init?.data || null;
  }
}

export class BaseResponseDataNull extends BaseResponse {
  @ApiProperty({
    type: Number,
    example: null,
  })
  data: unknown;
}
