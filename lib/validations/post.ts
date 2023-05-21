import * as z from "zod"

export const postPatchSchema = z.object({
  title: z.string().min(3).max(128).optional(),

  // TODO: Type this properly from editorjs block types?
  content: z.any().optional(),

  category: z.string().optional(),
})

export const postCommentSchema = z.object({
  // TODO: Type this properly from editorjs block types?
  comment: z.any().optional(),
})


