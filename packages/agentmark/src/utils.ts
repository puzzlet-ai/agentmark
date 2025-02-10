import {
  AgentMarkStreamOutput,
  AgentMarkTextSettings,
  ChatMessage,
  InferenceOptions,
  JSONObject,
} from "./types";
import { jsonSchema, LanguageModel } from "ai";
import { AgentMarkOutput, AgentMarkSettings, AISDKBaseSettings } from "./types";
import { streamObject, streamText, generateObject, generateText } from "ai";
import { ToolPluginRegistry } from "./tool-plugin-registry";
import { AgentMarkSettingsSchema } from "./schemas";

const OUTPUT_VERSION = "v2.0";

export function omit<T extends JSONObject>(
  obj: T,
  ...keysToOmit: (keyof T)[]
): Partial<T> {
  const result: Partial<T> = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key) && !keysToOmit.includes(key)) {
      result[key] = obj[key];
    }
  }

  return result;
}

export function toFrontMatter(content: JSONObject): string {
  function jsonToFrontMatter(json: JSONObject, indent = 0) {
    let frontMatter = "";
    const indentation = "  ".repeat(indent);

    for (const key in json) {
      if (json.hasOwnProperty(key)) {
        const value = json[key];

        if (typeof value === "object" && !Array.isArray(value)) {
          frontMatter += `${indentation}${key}:\n`;
          frontMatter += jsonToFrontMatter(value, indent + 1);
        } else if (Array.isArray(value)) {
          frontMatter += `${indentation}${key}:\n`;
          value.forEach((item) => {
            if (typeof item === "object") {
              frontMatter += `${indentation}-\n`;
              frontMatter += jsonToFrontMatter(item, indent + 2);
            } else {
              frontMatter += `${indentation}- ${item}\n`;
            }
          });
        } else {
          frontMatter += `${indentation}${key}: ${value}\n`;
        }
      }
    }

    return frontMatter;
  }

  return `---\n${jsonToFrontMatter(content)}---\n`;
}

export function getEnv(key: string) {
  if (process.env[key]) {
    return process.env[key];
  }

  throw new Error(`Env not found: ${key}`);
}

export function createToolsConfig(tools: AgentMarkTextSettings["tools"]) {
  if (!tools) return undefined;
  return Object.entries(tools).reduce((acc: any, [toolName, toolData]) => {
    const toolFn = ToolPluginRegistry.getTool(toolName);
    acc[toolName] = {
      description: toolData.description,
      parameters: jsonSchema(toolData.parameters as any),
      execute: (args: any) => {
        if (!toolFn) {
          throw new Error(`Tool not found: ${toolName}`);
        }
        const result =  toolFn(args);
        console.log("result-tool", result);
        return result;
      },
    };
    return acc;
  }, {});
}

export function getBaseSettings(
  config: AgentMarkSettings,
  model: LanguageModel,
  messages: Array<ChatMessage>
): AISDKBaseSettings {
  return {
    messages: messages,
    model: model,
    maxTokens: config.max_tokens,
    temperature: config.temperature,
    topK: config.top_k,
    maxSteps: config.max_llm_calls,
    topP: config.top_p,
    presencePenalty: config.frequency_penalty,
    stopSequences: config.stop_sequences,
    seed: config.seed,
    maxRetries: config.max_retries,
    headers: config.headers,
  };
}

export async function runInference(
  config: AgentMarkSettings,
  model: LanguageModel,
  messages: Array<ChatMessage>,
  options?: InferenceOptions
): Promise<AgentMarkOutput> {
  const baseConfig = getBaseSettings(config, model, messages);
  baseConfig.experimental_telemetry = options?.telemetry;
  const settings = AgentMarkSettingsSchema.parse(config);
  if ("schema" in settings) {
    const result = await generateObject({
      ...baseConfig,
      schema: jsonSchema(settings.schema as any),
    });
    return {
      result: result.object,
      tools: [],
      version: OUTPUT_VERSION,
      usage: result.usage,
      finishReason: result.finishReason,
    };
  } else {
    const tools = createToolsConfig(settings.tools);
    const result = await generateText({
      ...baseConfig,
      tools,
    });
    const steps = result.steps;
    let toolCalls: any[] = [];
    let toolResults: any[] = [];
    if(result.toolCalls) {
      toolCalls = result.toolCalls.map((tool) => ({
        name: tool.toolName,
        input: tool.args,
      }));
    }
    if(result.toolResults) {
      toolResults = result.toolResults
    }

    if(steps.length > 0) {
      toolCalls = steps.flatMap((step) => step.toolCalls.map((tool) => ({
        name: tool.toolName,
        input: tool.args,
      })));
      toolResults = steps.flatMap((step) => step.toolResults);
    }
    return {
      result: result.text,
      version: OUTPUT_VERSION,
      tools: toolCalls,
      toolResponses: toolResults,
      usage: result.usage,
      finishReason: result.finishReason,
    };
  }
}

export async function streamInference(
  config: AgentMarkSettings,
  model: LanguageModel,
  messages: Array<ChatMessage>,
  options?: InferenceOptions
): Promise<AgentMarkStreamOutput> {
  const baseConfig = getBaseSettings(config, model, messages);
  baseConfig.experimental_telemetry = options?.telemetry;
  const settings = AgentMarkSettingsSchema.parse(config);
  if ("schema" in settings) {
    return new Promise(async (resolve, reject) => {
      try {
        const { partialObjectStream, usage } = streamObject({
          ...baseConfig,
          schema: jsonSchema(settings.schema as any),
        });
        resolve({
          resultStream: partialObjectStream as AsyncIterable<Partial<any>>,
          version: OUTPUT_VERSION,
          usage: usage,
          finishReason: Promise.resolve("unknown"),
        });
      } catch (error) {
        reject(error);
      }
    });
  } else {
    return new Promise(async (resolve, reject) => {
      try {
        const { textStream, usage, toolCalls, toolResults, finishReason } = streamText({
          ...baseConfig,
          tools: createToolsConfig(settings.tools),
        });
        resolve({
          resultStream: textStream as AsyncIterable<Partial<any>>,
          version: OUTPUT_VERSION,
          usage: usage,
          tools: toolCalls.then((calls) => calls.map((call) => ({
            name: call.toolName,
            input: call.args,
          }))),
          toolResponses: toolResults,
          finishReason: finishReason as any,
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}
