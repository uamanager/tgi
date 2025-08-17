import { IJobCreateResponseDto } from '@tgi/shared';
import { ResponseDto } from '@tgi/server-core';
import { JobResponseResultDto } from './job.response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class JobCreateResponseDto
  extends ResponseDto<JobResponseResultDto>
  implements IJobCreateResponseDto
{
  @ApiProperty({
    type: () => JobResponseResultDto,
    description: 'Result',
  })
  override result!: JobResponseResultDto;
}
