import z from "zod";

export const uploadProjectSchema = z.object({
  containerName: z.string().min(1, "Container name is required"),
  port: z
    .number()
    .min(1, "Port range must between 1 to 65535")
    .max(65535, "Port range must between 1 to 65535"),
  domainName: z.string().min(1, "Domain is required"),
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
