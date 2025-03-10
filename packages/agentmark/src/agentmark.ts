import { Loader, TemplateEngine, Adapter } from "./types";
import { TextPrompt, ObjectPrompt, ImagePrompt } from "./prompts";
import { TextConfigSchema, ObjectConfigSchema, ImageConfigSchema } from "./schemas";
import { TemplatedxTemplateEngine } from "./template_engines/templatedx";
import { DefaultAdapter } from "./adapters/default";

type AgentMarkOptions = {
  loader: Loader;
  adapter?: Adapter;
  templateEngine?: TemplateEngine;
}

export interface TypedPrompt<I = any, O = any> {
  input: I;
  output: O;
}

export interface PromptTypeMap {
  [path: string]: TypedPrompt;
}

export class AgentMark<T extends PromptTypeMap = PromptTypeMap, A extends Adapter = Adapter> {
  protected loader: Loader;
  protected adapter: A;
  protected templateEngine: TemplateEngine;
  constructor({
    loader,
    adapter = new DefaultAdapter() as any as A,
    templateEngine = new TemplatedxTemplateEngine(),
  }: AgentMarkOptions) {
    this.loader = loader;
    this.templateEngine = templateEngine;
    this.adapter = adapter as A;
  }

  async loadTextPrompt<K extends keyof T & string>(pathOrPreloaded: K): Promise<TextPrompt<T[K]["input"], A>> {
    if (typeof pathOrPreloaded === 'string') {
      const template = await this.loader.load(pathOrPreloaded);
      TextConfigSchema.parse(await this.templateEngine.format(template));
      return new TextPrompt<T[K]["input"], A>(template, this.templateEngine, this.adapter);
    }
    return new TextPrompt<T[K]["input"], A>(pathOrPreloaded, this.templateEngine, this.adapter);
  }

  async loadObjectPrompt<K extends keyof T & string>(pathOrPreloaded: K): Promise<ObjectPrompt<T[K]["input"], A>> {
    if (typeof pathOrPreloaded === 'string') {
      const content = await this.loader.load(pathOrPreloaded);
      ObjectConfigSchema.parse(await this.templateEngine.format(content));
      return new ObjectPrompt<T[K]["input"], A>(content, this.templateEngine, this.adapter);
    }
    return new ObjectPrompt<T[K]["input"], A>(pathOrPreloaded, this.templateEngine, this.adapter);
  }

  async loadImagePrompt<K extends keyof T & string>(pathOrPreloaded: K): Promise<ImagePrompt<T[K]["input"], A>> {
    if (typeof pathOrPreloaded === 'string') {
      const content = await this.loader.load(pathOrPreloaded);
      ImageConfigSchema.parse(await this.templateEngine.format(content));
      return new ImagePrompt<T[K]["input"], A>(content, this.templateEngine, this.adapter);
    }
    return new ImagePrompt<T[K]["input"], A>(pathOrPreloaded, this.templateEngine, this.adapter);
  }
}