import { ModuleMetadata, Type } from '@nestjs/common';
import { ClientOptions } from 'openai';

export type OpenAIModuleOptions = ClientOptions;

export interface OpenAIModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (
    ...args: any[]
  ) => Promise<OpenAIModuleOptions> | OpenAIModuleOptions;
  inject?: any[];
  useExisting?: Type<OpenAIModuleOptionsFactory> | string;
  useClass?: Type<OpenAIModuleOptionsFactory>;
}

export interface OpenAIModuleOptionsFactory {
  createOpenAIModuleOptions(name?: string):
    | Promise<OpenAIModuleOptions>
    | OpenAIModuleOptions;
}