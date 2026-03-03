import {
  DynamicModule,
  Global,
  Module,
  Provider,
} from '@nestjs/common';
import OpenAI from 'openai';
import {
  OPENAI_MODULE_OPTIONS,
  OPENAI_CLIENT,
} from './openai.constants';
import {
  OpenAIModuleOptions,
  OpenAIModuleAsyncOptions,
  OpenAIModuleOptionsFactory,
} from './openai.types';

@Global()
@Module({})
export class OpenAIModule {
  static forRoot({ name, ...options }: OpenAIModuleOptions & { name?: string; }): DynamicModule {
    const clientProvider: Provider = {
      provide: OPENAI_CLIENT(name),
      useValue: new OpenAI(options),
    };

    return {
      module: OpenAIModule,
      providers: [
        { provide: OPENAI_MODULE_OPTIONS(name), useValue: options },
        clientProvider,
      ],
      exports: [OPENAI_CLIENT(name)],
    };
  }

  static forRootAsync(
    { name, ...options }: OpenAIModuleAsyncOptions & { name?: string; },
  ): DynamicModule {
    const asyncProviders = this.createAsyncProviders(options, name);

    const clientProvider: Provider = {
      provide: OPENAI_CLIENT(name),
      useFactory: async (opts: OpenAIModuleOptions) => {
        return new OpenAI(opts);
      },
      inject: [OPENAI_MODULE_OPTIONS(name)],
    };

    return {
      module: OpenAIModule,
      imports: options.imports,
      providers: [
        ...asyncProviders,
        clientProvider,
      ],
      exports: [clientProvider],
    };
  }

  private static createAsyncProviders(
    options: OpenAIModuleAsyncOptions,
    name?: string,
  ): Provider[] {
    if (options.useFactory) {
      return [
        {
          provide: OPENAI_MODULE_OPTIONS(name),
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
      ];
    }

    if (options.useExisting) {
      return [
        {
          provide: OPENAI_MODULE_OPTIONS(name),
          useFactory: async (
            optionsFactory: OpenAIModuleOptionsFactory,
          ) => optionsFactory.createOpenAIModuleOptions(name),
          inject: [options.useExisting],
        },
      ];
    }

    if (options.useClass) {
      return [
        {
          provide: OPENAI_MODULE_OPTIONS(name),
          useFactory: async (
            optionsFactory: OpenAIModuleOptionsFactory,
          ) => optionsFactory.createOpenAIModuleOptions(name),
          inject: [options.useClass],
        },
        {
          provide: options.useClass,
          useClass: options.useClass,
        },
      ];
    }

    throw new Error('Invalid async configuration');
  }
}