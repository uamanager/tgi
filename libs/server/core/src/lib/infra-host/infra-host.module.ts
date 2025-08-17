import { DynamicModule, Module, ModuleMetadata, Provider } from '@nestjs/common';
import { Type } from '@nestjs/common/interfaces/type.interface';
import { ForwardReference } from '@nestjs/common/interfaces/modules/forward-reference.interface';

export interface IServerCoreInfraHostModuleProvider
  extends Pick<ModuleMetadata, 'imports'> {
  providers?: Provider[];
}

@Module({})
export class ServerCoreInfraHostModule {
  static register(...configs: IServerCoreInfraHostModuleProvider[]): DynamicModule {
    const _configs = configs || [];
    const _imports = _configs.reduce(
      (accum, curr) => {
        return [...accum, ...(curr.imports || [])];
      },
      [] as Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference>,
    );

    const _providers = _configs.reduce((accum, curr) => {
      return [...accum, ...(curr.providers || [])];
    }, [] as Provider[]);

    return {
      global: true,
      module: ServerCoreInfraHostModule,
      imports: _imports,
      providers: _providers,
      exports: _providers,
    };
  }
}
