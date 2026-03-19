import { betterAuth } from "better-auth";
import { db } from "./db";

export const auth = betterAuth({
    database: db,
    emailAndPassword: {
        enabled: true,
    },
    user: {
        additionalFields: {
            username: {
                type: "string",
                required: false, // Optional because some might sign up with just email initially
            }
        }
    }
});
