import { expect, test } from "vitest";
import { vi } from "vitest";
import { getFrontMatter, load } from "@puzzlet/templatedx";
import { PluginAPI, getRawConfig } from "@puzzlet/agentmark";
import OllamaChatPlugin from "../src";
import fs from "fs";
import {
  ollamaCompletionParamsWithSchema,
  ollamaCompletionParamsWithTools,
  promptWithHistory,
} from "./configs";

const plugin = new OllamaChatPlugin();

export const getMdxPrompt = async (path: string) => {
  const input = fs.readFileSync(path, "utf-8");
  return input;
};

test("should deserialize", async () => {
  const ast = await load(__dirname + "/mdx/basic.prompt.mdx");
  const agentMark = await getRawConfig(ast);
  const deserialized = await plugin.deserialize(agentMark, PluginAPI);
  expect(deserialized).toEqual({
    messages: [
      {
        content: "What's 2 + 2?",
        role: "user",
      },
      {
        content: "5",
        role: "assistant",
      },
      {
        content: "Why are you bad at math?",
        role: "user",
      },
    ],
    model: "llama3.2",
    options: {
      temperature: 0.7,
      top_p: 1,
    },
    stream: false,
  });
});

test("should deserialize tools with no stream", async () => {
  const ast = await load(__dirname + "/mdx/tools.prompt.mdx");
  const agentMark = await getRawConfig(ast);
  const deserializedPrompt = await plugin.deserialize(agentMark, PluginAPI);
  expect(deserializedPrompt).toEqual(ollamaCompletionParamsWithTools(false));
});

test("should deserialize tools with stream", async () => {
  const ast = await load(__dirname + "/mdx/tools-stream.prompt.mdx");
  const agentMark = await getRawConfig(ast);
  const deserializedPrompt = await plugin.deserialize(agentMark, PluginAPI, {
    withStream: true,
  });
  expect(deserializedPrompt).toEqual(ollamaCompletionParamsWithTools(true));
});

test("should deserialize schema with stream", async () => {
  const ast = await load(__dirname + "/mdx/schema-stream.prompt.mdx");
  const agentMark = await getRawConfig(ast);
  const deserializedPrompt = await plugin.deserialize(agentMark, PluginAPI, {
    withStream: true,
  });
  expect(deserializedPrompt).toEqual(ollamaCompletionParamsWithSchema(true));
});

test("should deserialize schema with no stream", async () => {
  const ast = await load(__dirname + "/mdx/schema.prompt.mdx");
  const agentMark = await getRawConfig(ast);
  const deserializedPrompt = await plugin.deserialize(agentMark, PluginAPI);
  expect(deserializedPrompt).toEqual(ollamaCompletionParamsWithSchema(false));
});

test("run inference with no stream", async () => {
  const ast = await load(__dirname + "/mdx/basic.prompt.mdx");
  const mockFetch = vi.fn(() =>
    Promise.resolve(
      new Response(
        JSON.stringify({
          model: "llama3.2",
          created_at: "2024-12-03T15:01:03.000Z",
          message: {
            content: "Mocked response.",
            role: "assistant",
          },
          done: true,
          done_reason: "stop",
          total_duration: 500000000,
          load_duration: 100000000,
          prompt_eval_count: 5,
          prompt_eval_duration: 50000000,
          finish_reason: "stop",
          eval_count: 10,
          eval_duration: 350000000,
          context: "",
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: 200,
          statusText: "OK",
        }
      )
    )
  );
  const api = { ...PluginAPI, fetch: mockFetch };
  const pluginWithInference = new OllamaChatPlugin();
  const agentMark = await getRawConfig(ast);
  const { steps, ...result } = await pluginWithInference.runInference(
    agentMark,
    api
  );

  expect(
    steps?.map(
      ({ response: { messages, timestamp, id, ...response }, ...step }) => ({
        ...step,
        response: {
          ...response,
          messages: messages.map(({ id, ...message }) => message),
        },
      })
    )
  ).toEqual([
    {
      experimental_providerMetadata: undefined,
      finishReason: "stop",
      isContinued: false,
      logprobs: undefined,
      providerMetadata: undefined,
      reasoning: undefined,
      request: {
        body: '{"model":"llama3.2","options":{"temperature":0.7,"top_p":1},"messages":[{"content":"What\'s 2 + 2?","role":"user"},{"content":"5","role":"assistant"},{"content":"Why are you bad at math?","role":"user"}],"stream":false}',
      },
      response: {
        headers: {
          "content-type": "application/json",
        },
        messages: [
          {
            content: [
              {
                text: "Mocked response.",
                type: "text",
              },
            ],
            role: "assistant",
          },
        ],
        modelId: "llama3.2",
      },
      sources: [],
      stepType: "initial",
      text: "Mocked response.",
      toolCalls: [],
      toolResults: [],
      usage: {
        completionTokens: 10,
        promptTokens: 5,
        totalTokens: 15,
      },
      warnings: [],
    },
  ]);

  expect(result).toEqual({
    finishReason: "stop",
    result: "Mocked response.",
    tools: [],
    toolResponses: [],
    version: "v2.0",
    usage: {
      completionTokens: 10,
      promptTokens: 5,
      totalTokens: 15,
    },
  });
});

test.skip("run inference with stream", async () => {
  const ast = await load(__dirname + "/mdx/basic-stream.prompt.mdx");
  const mockStreamedFetch = vi.fn(() => {
    const stream = new ReadableStream({
      start(controller) {
        const chunks = [
          JSON.stringify({
            model: "llama3.2",
            created_at: "2023-08-04T08:52:19.385406455-07:00",
            message: {
              content: "Mocked ",
              role: "assistant",
              images: null,
            },
            done: false,
          }),
          JSON.stringify({
            model: "llama3.2",
            created_at: "2023-08-04T08:52:19.385406455-07:00",
            message: {
              content: " response.",
              role: "assistant",
              images: null,
            },
            done: false,
          }),
          JSON.stringify({
            model: "llama3.2",
            created_at: "2023-08-04T08:52:19.385406455-07:00",
            done: true,
            total_duration: 500000000,
            load_duration: 100000000,
            prompt_eval_count: 5,
            prompt_eval_duration: 50000000,
            eval_count: 10,
            eval_duration: 350000000,
          }),
        ];

        chunks.forEach((chunk, index) => {
          controller.enqueue(new TextEncoder().encode(`${chunk}\n\n`));
          if (index === chunks.length - 1) {
            controller.close();
          }
        });
      },
    });

    return Promise.resolve(
      new Response(stream, {
        headers: { "Content-Type": "text/event-stream" },
        status: 200,
        statusText: "OK",
      })
    );
  });

  const api = { ...PluginAPI, fetch: mockStreamedFetch };
  const pluginWithInference = new OllamaChatPlugin();
  const agentMark = await getRawConfig(ast);
  const resultWithStream = await pluginWithInference.streamInference(
    agentMark,
    api
  );
  let message = "";
  for await (const chunk of resultWithStream.resultStream) {
    message += chunk;
  }

  const result = {
    result: message,
    tools: await resultWithStream.tools,
    toolResponses: await resultWithStream.toolResponses,
    usage: await resultWithStream.usage,
    version: resultWithStream.version,
  };
  expect(result).toEqual({
    result: "Mocked response.",
    tools: [],
    toolResponses: [],
    usage: {
      completionTokens: 10,
      promptTokens: 5,
      totalTokens: 15,
    },
    version: "v2.0",
  });
});

test("should deserialize prompt with history prop", async () => {
  const ast = await load(__dirname + "/mdx/props-history.prompt.mdx");
  const frontmatter = getFrontMatter(ast) as any;
  const agentMark = await getRawConfig(ast, frontmatter.test_settings.props);
  const deserializedPrompt = await plugin.deserialize(agentMark, PluginAPI);
  expect(deserializedPrompt).toEqual(promptWithHistory);
});
