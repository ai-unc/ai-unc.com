import { z } from "zod";

const emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+-\.]*)[A-Z0-9_'+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;

// TODO: Add constraints, like for allowed characters in names
export const schema = z.object({
	first_name: z.string().min(2).max(30),
	last_name: z.string().min(2).max(30),
	email: z.string().superRefine((data, ctx) => {
		if (!data.endsWith("unc.edu")) {
			ctx.addIssue({
				code: z.ZodIssueCode.invalid_string,
				message: "Please use your UNC email address",
				validation: "email",
			});
		} else if (!emailRegex.test(data)) {
			ctx.addIssue({
				code: z.ZodIssueCode.invalid_string,
				message: "Invalid email address",
				validation: "email",
			});
		}
	}),
	is_beginner_track: z.boolean().default(false),
});
