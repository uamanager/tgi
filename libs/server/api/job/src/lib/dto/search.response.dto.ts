import { IJobSearchResponseDto } from '@tgi/shared';
import { ResponseListDto } from '@tgi/server-core';
import { ApiProperty } from '@nestjs/swagger';
import { JobResponseResultDto } from './job.response.dto';

export class JobSearchResponseDto
  extends ResponseListDto<JobResponseResultDto[]>
  implements IJobSearchResponseDto
{
  @ApiProperty({
    type: () => JobResponseResultDto,
    description: 'Result',
    isArray: true,
  })
  override result!: JobResponseResultDto[];
}
