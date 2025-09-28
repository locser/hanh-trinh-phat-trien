import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from './base.response';
import { StringUtil } from '../../utils/string.util';

export class AdministrativeUnitResponse {
  @ApiProperty({
    example: 1,
  })
  id: number;

  @ApiProperty({
    example: 'Hồ Chí Minh',
  })
  name: string;

  constructor(init?: string) {
    this.id = StringUtil.extractAddressInfoFromString(init, "id");
    this.name = StringUtil.extractAddressInfoFromString(init, "text");
  }

  static toStringData(data: AdministrativeUnitResponse){
    return `${data.id}|${data.name}`;
  }

  
}

export class AdministrativeUnitsResponseSwagger extends BaseResponse {
  @ApiProperty({
    type: [AdministrativeUnitResponse],
  })
  data: AdministrativeUnitResponse[];
}
