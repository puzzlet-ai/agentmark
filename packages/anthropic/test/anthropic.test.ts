import { expect, test, vi } from "vitest";
import fs from 'fs';
import { getFrontMatter, load } from "@puzzlet/templatedx";
import AnthropicChatPlugin from "../src";
import { getRawConfig, PluginAPI, ToolPluginRegistry } from "@puzzlet/agentmark";
import { anthropicCompletionParamsWithSchema, anthropicCompletionParamsWithTools, promptWithHistory } from "./configs";

vi.stubEnv("ANTHROPIC_API_KEY", "key");

const plugin = new AnthropicChatPlugin();

export const getMdxPrompt = async (path: string) => {
  const input = fs.readFileSync(path, 'utf-8');
  return input;
}

test("should serialize basic", async () => {
  const mdx = await getMdxPrompt(__dirname + "/mdx/basic.prompt.mdx");
  const serialized = plugin.serialize(
    {
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: [
            {
              text: "What's 2 + 2?",
              type: 'text',
            },
          ],
        },
        {
          role: 'assistant',
          content: [
            {
              text: '5',
              type: 'text',
            },
          ],
        },
        {
          role: 'user',
          content: [
            {
              text: 'Why are you bad at math?',
              type: 'text',
            },
          ],
        },
      ],
      model: 'claude-3-5-haiku-latest',
      temperature: 0.7,
      top_p: 1,
    },
    "basic-prompt",
    PluginAPI
  );
  expect(serialized).toEqual(mdx);
});

test("should deserialize basic", async () => {
  const ast = await load(__dirname + "/mdx/basic.prompt.mdx");
  const agentMark = await getRawConfig(ast);
  const deserialized = await plugin.deserialize(agentMark, PluginAPI);
  expect(deserialized).toEqual({
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: [
          {
            text: "What's 2 + 2?",
            type: 'text',
          },
        ],
      },
      {
        role: 'assistant',
        content: [
          {
            text: '5',
            type: 'text',
          },
        ],
      },
      {
        role: 'user',
        content: [
          {
            text: 'Why are you bad at math?',
            type: 'text',
          },
        ],
      },
    ],
    model: 'claude-3-5-haiku-latest',
    temperature: 0.7,
    top_p: 1,
  });
});

test("should serialize tools with no stream", async () => {
  const mdx = await getMdxPrompt(__dirname + "/mdx/tools.prompt.mdx");
  const serialized = plugin.serialize(
    anthropicCompletionParamsWithTools(false),
    "calculate",
    PluginAPI
  );
  expect(serialized).toEqual(mdx);
});

test("should deserialize tools with no stream", async () => {
  const ast = await load(__dirname + "/mdx/tools.prompt.mdx");
  const agentMark = await getRawConfig(ast);
  const deserializedPrompt = await plugin.deserialize(agentMark, PluginAPI);
  expect(deserializedPrompt).toEqual(anthropicCompletionParamsWithTools(false));
});

test("should serialize tools with stream", async () => {
  const mdx = await getMdxPrompt(__dirname + "/mdx/tools-stream.prompt.mdx");
  const serialized = plugin.serialize(
    anthropicCompletionParamsWithTools(true),
    "calculate",
    PluginAPI
  );
  expect(serialized).toEqual(mdx);
});

test("should deserialize tools with stream", async () => {
  const ast = await load(__dirname + "/mdx/tools-stream.prompt.mdx");
  const agentMark = await getRawConfig(ast);
  const deserializedPrompt = await plugin.deserialize(agentMark, PluginAPI);
  expect(deserializedPrompt).toEqual(anthropicCompletionParamsWithTools(true));
});

test("should serialize schema with stream", async () => {
  const mdx = await getMdxPrompt(__dirname + "/mdx/schema-stream.prompt.mdx");
  const serialized = plugin.serialize(
    anthropicCompletionParamsWithSchema(true),
    "calculate",
    PluginAPI
  );
  expect(serialized).toEqual(mdx);
});

test("should deserialize schema with stream", async () => {
  const ast = await load(__dirname + "/mdx/schema-stream.prompt.mdx");
  const agentMark = await getRawConfig(ast);
  const deserializedPrompt = await plugin.deserialize(agentMark, PluginAPI);
  expect(deserializedPrompt).toEqual(anthropicCompletionParamsWithSchema(true));
});

test("should serialize schema with no stream", async () => {
  const mdx = await getMdxPrompt(__dirname + "/mdx/schema.prompt.mdx");

  const serialized = plugin.serialize(
    anthropicCompletionParamsWithSchema(false),
    "calculate",
    PluginAPI
  );

  expect(serialized).toEqual(mdx);
});

test("should deserialize schema with no stream", async () => {
  const ast = await load(__dirname + "/mdx/schema.prompt.mdx");
  const agentMark = await getRawConfig(ast);
  const deserializedPrompt = await plugin.deserialize(agentMark, PluginAPI);
  expect(deserializedPrompt).toEqual(anthropicCompletionParamsWithSchema(false));
});

test("should deserialize prompt with history prop", async () => {
  const ast = await load(__dirname + "/mdx/props-history.prompt.mdx");
  const frontmatter = getFrontMatter(ast) as any;
  const agentMark = await getRawConfig(ast, frontmatter.test_settings.props);
  const deserializedPrompt = await plugin.deserialize(agentMark, PluginAPI);
  expect(deserializedPrompt).toEqual(promptWithHistory);
});

test("run inference with no stream", async () => {
  const ast = await load(__dirname + "/mdx/basic.prompt.mdx");
  const mockFetch = vi.fn(() =>
    Promise.resolve(
      new Response(
        JSON.stringify({
          type: "message",
          content: [
            {
              type: "text",
              role: "assistant",
              text: "Mocked response."
            }
          ],
          stop_reason: "stop_sequence",
          truncated: false,
          tokens_consumed: 15,
          model: "claude-3-5-sonnet-latest",
          usage: {
            input_tokens: 10,
            output_tokens: 15,
            total_tokens: 25
          }
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: 200,
          statusText: "OK"
        }
      )
    )
  );  
  
  const api = { ...PluginAPI, fetch: mockFetch }
  const pluginWithInference = new AnthropicChatPlugin();
  const agentMark = await getRawConfig(ast);
  const result = await pluginWithInference.runInference(agentMark, api);

  expect(result).toEqual({
    finishReason: "stop",
    result: {
      text: "Mocked response.",
    },
    toolResponses: [],
    tools: [],
    usage: {
      completionTokens: 15,
      promptTokens: 10,
      totalTokens: 25,
    },
  });
});

test("should execute tools", async () => {
  ToolPluginRegistry
    .register(async ({ location }: { location: string }) => {
      return `Cold af in ${location}`;
  }, "weather");

  const ast = await load(__dirname + "/mdx/tools.prompt.mdx");
  const mockFetch = vi.fn(() =>
    Promise.resolve(
      new Response(
        JSON.stringify({
          type: "message",
          content: [
            {
              id: "unique-tool-call-id",
              name: "weather",
              type: "tool_use",
              input: {
                location: "New Hampshire"
              }
            },
            {
              type: "text",
              role: "assistant",
              text: "The weather in New Hampshire is cold af."
            }
          ],
          stop_reason: "stop_sequence",
          role: "assistant",
          truncated: false,
          tokens_consumed: 15,
          model: "claude-3-5-sonnet-latest",
          usage: {
            input_tokens: 10,
            output_tokens: 15,
            total_tokens: 25
          }
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: 200,
          statusText: "OK"
        }
      )
    )
  );  
  
  const api = { ...PluginAPI, fetch: mockFetch }
  const pluginWithInference = new AnthropicChatPlugin();
  const agentMark = await getRawConfig(ast);
  const result = await pluginWithInference.runInference(agentMark, api);

  expect(result).toEqual({
    finishReason: "stop",
    result: {
      text: "The weather in New Hampshire is cold af."
    },
    tools: [
      {
        input: {
          location: "New Hampshire"
        },
        name: "weather"
      }
    ],
    toolResponses: [
      {
        args: {
          location: "New Hampshire",
        },
        result: "Cold af in New Hampshire",
        toolCallId: "unique-tool-call-id",
        toolName: "weather",
      },
    ],
    usage: {
      completionTokens: 15,
      promptTokens: 10,
      totalTokens: 25
    }
  });
});

test("run inference with stream", async () => {
  const ast = await load(__dirname + "/mdx/basic-stream.prompt.mdx");
  const mockStreamedFetch = vi.fn(() => {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        const events = [
          {
            event: "message_start",
            data: {
              type: "message_start",
              message: {
                id: "msg_mock_1",
                type: "message",
                role: "assistant",
                content: [],
                model: "claude-3-5-sonnet-latest",
                stop_reason: null,
                stop_sequence: null,
                usage: { input_tokens: 10, output_tokens: 0, total_tokens: 10 }
              }
            }
          },
          {
            event: "content_block_start",
            data: {
              type: "content_block_start",
              index: 0,
              content_block: { type: "text", text: "" }
            }
          },
          {
            event: "content_block_delta",
            data: {
              type: "content_block_delta",
              index: 0,
              delta: { type: "text_delta", text: "Mocked " }
            }
          },
          {
            event: "content_block_delta",
            data: {
              type: "content_block_delta",
              index: 0,
              delta: { type: "text_delta", text: "response." }
            }
          },
          {
            event: "content_block_stop",
            data: {
              type: "content_block_stop",
              index: 0
            }
          },
          {
            event: "message_delta",
            data: {
              type: "message_delta",
              delta: { stop_reason: "stop_sequence", stop_sequence: null },
              usage: { input_tokens: 10, output_tokens: 15, total_tokens: 25 }
            }
          },
          {
            event: "message_stop",
            data: { type: "message_stop" }
          }
        ];
  
        events.forEach((event) => {
          const sseMessage = `event: ${event.event}\ndata: ${JSON.stringify(event.data)}\n\n`;
          controller.enqueue(encoder.encode(sseMessage));
        });
  
        controller.close();
      }
    });
  
    return Promise.resolve(
      new Response(stream, {
        headers: { "Content-Type": "text/event-stream" },
        status: 200,
        statusText: "OK"
      })
    );
  });
  
  
  const api = { ...PluginAPI, fetch: mockStreamedFetch };
  const pluginWithInference = new AnthropicChatPlugin();
  const agentMark = await getRawConfig(ast);
  const result = await pluginWithInference.runInference(agentMark, api);
  expect(result).toEqual({
    finishReason: "stop",
    result: {
      text: "Mocked response.",
    },
    tools: [],
    toolResponses: [],
    usage: {
      completionTokens: 15,
      totalTokens: 25,
      promptTokens: 10,
    },
  });
});
