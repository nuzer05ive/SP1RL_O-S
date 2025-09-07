import { z } from 'zod';

export const walEventSchema = z.object({
  id: z.string(),
  t: z.string(),
  type: z.string(),
  scene_id: z.string(),
  user_id: z.string(),
  req_id: z.string(),
  model_semver: z.string(),
  kernel_digest: z.string(),
  payload: z.record(z.any()),
  status: z.enum(['OK', 'FAILED'])
});

export const hdpcIntentSchema = z.object({
  scene_id: z.string().default('default'),
  moral: z.string().min(1),
  dilemma: z.string().min(1),
  stakes: z.string().min(1)
});

export const hdpcDesignSchema = z.object({
  scene_id: z.string().default('default'),
  hats: z.array(z.string()),
  constraints: z.object({
    humane: z.boolean(),
    moral: z.string(),
    dilemma: z.string(),
    stakes: z.string()
  })
});

export const hdpcTrialsSchema = z.object({
  scene_id: z.string().default('default'),
  hats: z.array(
    z.object({
      name: z.string(),
      pass: z.boolean(),
      score: z.number().optional()
    })
  )
});

export const hdpcFinalizeSchema = z.object({
  scene_id: z.string().default('default'),
  constraints: z.object({
    humane: z.boolean(),
    moral: z.string(),
    dilemma: z.string(),
    stakes: z.string()
  }),
  hats: z.array(
    z.object({
      name: z.string(),
      pass: z.boolean(),
      score: z.number().optional()
    })
  )
});

export const zenavaArcadeSchema = z.object({
  scene_id: z.string().default('default'),
  candidates: z.array(
    z.object({ id: z.string(), L: z.number() })
  )
});

export const zenavaFabricateSchema = z.object({
  scene_id: z.string().default('default'),
  winner: z.object({ id: z.string(), L: z.number() })
});

export const zenavaFinalizeSchema = z.object({
  scene_id: z.string().default('default'),
  mesh: z.object({
    kind: z.string(),
    geom: z.object({
      positions: z.array(z.number()),
      indices: z.array(z.number()),
    })
  }),
  coat: z.object({
    finish: z.string(),
    color: z.string().optional()
  })
});

export type WalEventInput = z.infer<typeof walEventSchema>;
export type HDPCIntent = z.infer<typeof hdpcIntentSchema>;
export type HDPCDesign = z.infer<typeof hdpcDesignSchema>;
export type HDPCTrials = z.infer<typeof hdpcTrialsSchema>;
export type HDPCFinalize = z.infer<typeof hdpcFinalizeSchema>;
export type ZenavaArcade = z.infer<typeof zenavaArcadeSchema>;
export type ZenavaFabricate = z.infer<typeof zenavaFabricateSchema>;
export type ZenavaFinalize = z.infer<typeof zenavaFinalizeSchema>;
