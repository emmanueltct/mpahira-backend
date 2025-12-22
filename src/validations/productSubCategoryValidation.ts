import { z } from "zod";

export const createSubCategorySchema = z.object({
  body: z.object({
    categoryId: z.string().min(1, "categoryId is required"),
    subCategoryEng: z.string().min(1, "English subcategory name is required"),
    subCategoryKiny: z.string().min(1, "Kinyarwanda subcategory name is required"),
  }),
  file: z
    .object({
      fieldname: z.string(),
      originalname: z.string(),
      mimetype: z.string().regex(/^image\//, "File must be an image"),
      size: z.number().max(2 * 1024 * 1024, "Image must be <= 2MB"), // ✅ max size 2MB
    })
    .optional(),
});

export const updateSubCategorySchema = z.object({
  body: z.object({
    subCategoryEng: z.string().min(1, "English subcategory name is required").optional(),
    subCategoryKiny: z.string().min(1, "Kinyarwanda subcategory name is required").optional(),
  }),
  params: z.object({
    id: z.string().uuid("Invalid subcategory ID"),
  }),
});

export const getSubCategoryByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid subcategory ID"),
  }),
});

export const deleteSubCategorySchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid subcategory ID"),
  }),
});
