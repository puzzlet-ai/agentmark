import {
  TextSettings,
  ObjectSettings,
  ImageSettings,
  TextConfig,
  ObjectConfig,
  ImageConfig,
  ChatMessage
} from './schemas';

export type JSONPrimitive = string | number | boolean | null;
export type JSONValue = JSONPrimitive | JSONObject | JSONArray;
export type JSONObject = { [key: string]: JSONValue };
export type JSONArray = JSONValue[];

export type {
  TextSettings,
  ObjectSettings,
  ImageSettings,
  TextConfig,
  ObjectConfig,
  ImageConfig,
  ChatMessage
};

export interface Loader<T = any> {
  load(path: string): Promise<T>;
}

export interface TemplateEngine {
  compile(
    template: any,
    props?: JSONObject,
  ): any;
}

export interface PromptMetadata {
  props: JSONObject;
  path: string | undefined;
  template: any;
}

export interface Adapter<TextOutput = any, ObjectOutput = any, ImageOutput = any> {
  adaptText(input: TextConfig, options: AdaptOptions, settings: PromptMetadata): TextOutput;
  adaptObject(input: ObjectConfig, options: AdaptOptions, settings: PromptMetadata): ObjectOutput;
  adaptImage(input: ImageConfig, options: AdaptOptions, settings: PromptMetadata): ImageOutput;
}

export type AdaptOptions = {
  telemetry?: {
    isEnabled: boolean;
    functionId?: string;
    metadata?: Record<string, any>;
  }
  apiKey?: string;
  [key: string]: any;
}

export interface PromptType {
  input: any;
  output: any;
}