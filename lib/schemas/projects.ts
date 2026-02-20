import z from "zod";

export const uploadProjectSchema = z.object({
  containerName: z
    .string()
    .trim()
    .toLowerCase()
    .regex(
      /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/,
      "Invalid container name format",
    ),
  port: z
    .number()
    .min(1, "Port range must between 1 to 65535")
    .max(65535, "Port range must between 1 to 65535"),
  domainName: z
    .string()
    .trim()
    .toLowerCase()
    .regex(
      /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/,
      "Invalid subdomain format",
    ),
  projectType: z.string().min(1, "Project type is required"),
  projectFile: z
    .custom<File>((val) => val instanceof File, "Please upload .zip file")
    .refine(
      (file) => file.size <= 10 * 1024 * 1024,
      "Maximum file size is 10MB",
    )
    .refine(
      (file) => file.name.endsWith(".zip"),
      "Only .zip file type is allow",
    ),
});

export type UploadProjectSchema = z.infer<typeof uploadProjectSchema>;
