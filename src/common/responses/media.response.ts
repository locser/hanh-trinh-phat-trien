import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumberString, IsString, ValidateNested } from 'class-validator';

class MediaFormatResponse {
  @IsString()
  @ApiProperty({
    type: String,
  })
  url: string;

  @IsString()
  @ApiProperty({
    type: String,
  })
  name: string;

  @IsInt()
  @ApiProperty({
    type: Number,
  })
  size: number;

  @IsInt()
  @ApiProperty({
    type: Number,
  })
  width: number;

  @IsInt()
  @ApiProperty({
    type: Number,
  })
  height: number;

  constructor(init?: MediaFormatResponse) {
    this.url = init?.url || '';
    this.name = init?.name || '';
    this.size = +init?.size || 0;
    this.width = +init?.width || 0;
    this.height = +init?.height || 0;
  }
}

class MediaFormatOriginResponse extends MediaFormatResponse {
  @IsString()
  @ApiProperty({
    type: String,
  })
  link_full: string;

  constructor(init?: MediaFormatOriginResponse) {
    super(init);
    this.link_full = init?.link_full || '';
  }
}

export class MediaResponse {
  @IsNumberString({
    no_symbols: true,
  })
  @ApiProperty({
    type: String,
  })
  media_id: string;

  @IsInt()
  @ApiProperty({
    type: Number,
  })
  type: number;

  @ValidateNested()
  @Type(() => MediaFormatOriginResponse)
  @ApiProperty({
    type: MediaFormatOriginResponse,
  })
  original: MediaFormatOriginResponse;

  @ValidateNested()
  @Type(() => MediaFormatResponse)
  @ApiProperty({
    type: MediaFormatResponse,
  })
  medium: MediaFormatResponse;

  @ValidateNested()
  @Type(() => MediaFormatResponse)
  @ApiProperty({
    type: MediaFormatResponse,
  })
  thumb: MediaFormatResponse;

  constructor(init?: MediaResponse) {
    this.media_id = init?.media_id || '0';
    this.type = +init?.type || 0;
    this.original = new MediaFormatOriginResponse(init?.original);
    this.medium = new MediaFormatResponse(init?.medium);
    this.thumb = new MediaFormatResponse(init?.thumb);
  }

  static mapToList(data: MediaResponse[]) {
    return data.map((item) => new MediaResponse(item));
  }
}
