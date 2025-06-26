import { Elysia, t } from "elysia";
import type { DMs, User } from "./types";
import cors from "@elysiajs/cors";
import PocketBase from "pocketbase";

async function auth(header: string) {
	const pb = new PocketBase("http://localhost:8090");
	try {
		pb.authStore.save(header);
		if (!pb.authStore.isValid) {
			throw new Error("Invalid token");
		}
		await pb.collection("users").authRefresh();
		return pb;
	} catch (error) {
		throw new Error("Invalid token");
	}
}

const superuserpb = new PocketBase("http://localhost:8090");
superuserpb.collection("_superusers").authWithPassword(process.env.POCKETBASE_USERNAME || "", process.env.POCKETBASE_PASSWORD || "");

const usersapi = new Elysia()
	.post("/me/createDM", async ({ body: {username}, headers, status }) => {
		const pb = await auth(headers.authorization || "");
		if (!username || username.trim() === "") {
			return status(400, { message: "Username cannot be empty." });
		}
		let user: User;
		try {
			user = await superuserpb.collection<User>("users").getFirstListItem(`username = "${username}"`);
			if (!user) {
				return status(404, { message: "User not found." });
			}
		} catch (error) {
			console.error("Error fetching user:", error);
			return status(404, { message: "User not found." });
		}
		try{
			if (user.id === pb.authStore.record?.id) {
				return status(400, { message: "You cannot create a DM with yourself." });
			}
			const newDM = await superuserpb.collection<DMs>("dms").create({
				users: [pb.authStore.record?.id, user.id],
			});
			return {
				...newDM,
				expand: {
					users: [pb.authStore.record as User, user],
				},
			};
		} catch (error) {
			console.error("Error creating DM:", error);
			return status(500, { message: "Failed to create DM. Please try again." });
		}
	}, {
		body: t.Object({
			username: t.String(),
		}),
	})



const app = new Elysia()
	.use(cors())
	.use(usersapi)
	.listen(63273, ({ port }) => console.log(`Server is running on http://localhost:${port}`));
export type App = typeof app;
