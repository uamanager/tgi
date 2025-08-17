import { ServerApiJobService } from './job.api.service';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JobSearchRequestDtoQuery } from './dto/search.request.dto';
import { JobSearchResponseDto } from './dto/search.response.dto';
import { JobCreateResponseDto } from './dto/create.response.dto';
import { JobCreateRequestDtoBody } from './dto/create.request.dto';
import { JobStatsResponseDto } from './dto/stats.response.dto';

@ApiTags('job')
@Controller('job')
export class ServerApiJobController {
  constructor(private readonly $_jobApiService: ServerApiJobService) {}

  @ApiOperation({
    summary: 'Search jobs',
    description: 'Allows users to search jobs',
  })
  @ApiOkResponse({
    description: 'Jobs are found',
    type: JobSearchResponseDto,
  })
  @Get()
  async search(@Query() query: JobSearchRequestDtoQuery): Promise<JobSearchResponseDto> {
    return this.$_jobApiService.search(query);
  }

  @ApiOperation({
    summary: 'Create a new job',
    description: 'Allows users to create a new job',
  })
  @ApiOkResponse({
    description: 'Job created',
    type: JobCreateResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post()
  async create(@Body() body: JobCreateRequestDtoBody): Promise<JobCreateResponseDto> {
    return this.$_jobApiService.create(body);
  }

  @ApiOperation({
    summary: 'Calculate job statistics',
    description: 'Allows users to calculate job statistics',
  })
  @ApiOkResponse({
    description: 'Job statistics calculated',
    type: JobStatsResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Get('stats')
  async stats(): Promise<JobStatsResponseDto> {
    return this.$_jobApiService.stats();
  }
}
