import { ApiProperty } from '@nestjs/swagger';

export class BasePaginationResponse {
  @ApiProperty()
  limit: number;

  @ApiProperty()
  total_record: number;

  list: unknown[];

  constructor(init?: BasePaginationResponse) {
    this.limit = +init?.limit || 0;
    this.total_record = +init?.total_record || 0;
    this.list = init?.list || [];
  }
}
