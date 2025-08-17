import { MemoryCollection } from '../../../db';
import { JobEntity } from '@tgi/core';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ServerInfraMemoryJobSchema extends MemoryCollection<JobEntity> {}
