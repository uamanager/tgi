import { MemoryCollection } from '../../../db';
import { JobRunEntity } from '@tgi/core';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ServerInfraMemoryJobRunSchema extends MemoryCollection<JobRunEntity> {}
