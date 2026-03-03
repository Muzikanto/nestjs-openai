# @muzikanto/nestjs-openai

[![npm](https://img.shields.io/npm/v/@muzikanto/nestjs-openai)](https://www.npmjs.com/package/@muzikanto/nestjs-openai)
[![downloads](https://img.shields.io/npm/dt/@muzikanto/nestjs-openai)](<(https://www.npmjs.com/package/@muzikanto/nestjs-openai)>)
[![GitHub stars](https://img.shields.io/github/stars/Muzikanto/nestjs-openai?style=social)](https://github.com/Muzikanto/nestjs-openai)
[![License](https://img.shields.io/npm/l/@muzikanto/nestjs-openai)](https://github.com/Muzikanto/nestjs-openai/blob/main/LICENSE)

A lightweight NestJS module for integrating the official openai npm package into your NestJS application.

## Why Use This Module?

- Seamless integration with NestJS DI system
- Supports async configuration
- Multi-client support
- Clean and minimal implementation

---

## Installation

```bash
yarn add @muzikanto/nestjs-openai
# also
yarn add openai
```

Peer dependencies: `@nestjs/common, @nestjs/core`

## Quick Start

### Synchronous Registration (forRoot)

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { OpenAIModule } from '@muzikanto/nestjs-openai';

@Module({
  imports: [
    OpenAIModule.forRoot({
      name: 'test',
      apiKey: process.env.OPENAI_API_KEY,
    }),
  ],
})
export class AppModule {}
```

### Using the Client in a Service

```ts
import { Inject, Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { InjectOpenAI } from '@muzikanto/nestjs-openai';

@Injectable()
export class AiService {
  constructor(
    @InjectOpenAI('test') private readonly openai: OpenAI,
  ) {}

  async generateText() {
    const response = await this.openai.responses.create({
      model: 'gpt-4.1-mini',
      input: 'Write a short joke about NestJS',
    });

    return response.output_text;
  }
}
```

### Async Configuration (forRootAsync)

Useful when working with ConfigModule or external configuration providers.

Using useFactory

```ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OpenAIModule } from '@muzikanto/nestjs-openai';

@Module({
  imports: [
    ConfigModule.forRoot(),
    OpenAIModule.forRootAsync({
      name: 'test',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        apiKey: config.get<string>('OPENAI_API_KEY'),
      }),
    }),
  ],
})
export class AppModule {}
```

Using useClass

```ts
import { Injectable } from '@nestjs/common';
import { OpenAIModuleOptionsFactory } from '@muzikanto/nestjs-openai';

@Injectable()
export class OpenAIConfigService
  implements OpenAIModuleOptionsFactory
{
  createOpenAIModuleOptions() {
    return {
      apiKey: process.env.OPENAI_API_KEY,
    };
  }
}
```

```ts
OpenAIModule.forRootAsync({
  useClass: OpenAIConfigService,
});
```

### Multi-Instance Support

You can register multiple OpenAI clients with different configurations.

```ts
@Module({
  imports: [
    OpenAIModule.forRoot({
      name: 'primary',
      apiKey: process.env.OPENAI_API_KEY,
    }),
    OpenAIModule.forRoot({
      name: 'secondary',
      apiKey: process.env.OPENAI_API_KEY_2,
    }),
  ],
})
export class AppModule {}
```

```ts
@Injectable()
export class MultiAiService {
  constructor(
    @Inject(OPENAI_CLIENT('primary'))
    private readonly primaryClient: OpenAI,

    @Inject(OPENAI_CLIENT('secondary'))
    private readonly secondaryClient: OpenAI,
  ) {}
}
```

## Contributing

Contributions are welcome! Please open issues or submit PRs.

## Changelog

See [CHANGELOG](https://github.com/Muzikanto/nestjs-mcp/blob/main/CHANGELOG.md) for detailed version history and updates.
# nestjs-openai
