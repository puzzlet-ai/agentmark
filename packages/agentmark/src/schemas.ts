import { z } from "zod";

export const ChatMessageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant']),
  content: z.string(),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const TextSettingsConfig = z.object({
  max_tokens: z.number().optional(),
  temperature: z.number().optional(),
  max_calls: z.number().optional(),
  top_p: z.number().optional(),
  top_k: z.number().optional(),
  presence_penalty: z.number().optional(),
  frequency_penalty: z.number().optional(),
  stop_sequences: z.array(z.string()).optional(),
  seed: z.number().optional(),
  max_retries: z.number().optional(),
  tool_choice: z.union([
    z.enum(['auto', 'none', 'required']),
    z.object({
      type: z.literal('tool'),
      tool_name: z.string()
    })
  ]).optional(),
  tools: z
    .record(
      z.object({
        description: z.string(),
        parameters: z.unknown(),
      })
    )
    .optional(),
});

export type TextSettings = z.infer<typeof TextSettingsConfig>;

export const ObjectSettingsConfig = z.object({
  max_tokens: z.number().optional(),
  temperature: z.number().optional(),
  max_calls: z.number().optional(),
  top_p: z.number().optional(),
  top_k: z.number().optional(),
  presence_penalty: z.number().optional(),
  frequency_penalty: z.number().optional(),
  stop_sequences: z.array(z.string()).optional(),
  seed: z.number().optional(),
  max_retries: z.number().optional(),
  schema: z.unknown().optional(),
  schema_name: z.string().optional(),
  schema_description: z.string().optional(),
});

export type ObjectSettings = z.infer<typeof ObjectSettingsConfig>;

export const ImageSettingsConfig = z.object({
  num_images: z.number().optional(),
  size: z.string().regex(/^\d+x\d+$/).optional(),
  aspect_ratio: z.string().regex(/^\d+:\d+$/).optional(),
  seed: z.number().optional(),
});

export type ImageSettings = z.infer<typeof ImageSettingsConfig>;

export const TextConfigSchema = z.object({
  name: z.string(),
  messages: z.array(ChatMessageSchema),
  model: z.object({
    name: z.string(),
    settings: TextSettingsConfig,
  })
});

export type TextConfig = z.infer<typeof TextConfigSchema>;

export const ObjectConfigSchema = z.object({
  name: z.string(),
  messages: z.array(ChatMessageSchema),
  model: z.object({
    name: z.string(),
    settings: ObjectSettingsConfig,
  })
});

export type ObjectConfig = z.infer<typeof ObjectConfigSchema>;

export const ImageConfigSchema = z.object({
  name: z.string(),
  messages: z.array(ChatMessageSchema),
  model: z.object({
    name: z.string(),
    settings: ImageSettingsConfig,
  })
});

export type ImageConfig = z.infer<typeof ImageConfigSchema>;
