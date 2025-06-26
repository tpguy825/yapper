import { Elysia } from "elysia";
import type { DMs, User } from "./types";
import cors from "@elysiajs/cors";
import PocketBase from "pocketbase";

async function auth(header: string) {
	const pb = new PocketBase("http://localhost:8090");
	if (!header.startsWith("Bearer ")) {
		throw new Error("Invalid authorization header");
	}

	const token = header.slice(7);
	try {
		pb.authStore.save(token);
		if (!pb.authStore.isValid) {
			throw new Error("Invalid token");
		}
		await pb.collection("users").authRefresh();
		return pb;
	} catch (error) {
		throw new Error("Invalid token");
	}
}

const usersapi = new Elysia()
	.get("/me/userchats", async ({ status, headers }) => {
		const pb = await auth(headers.authorization || "");
		try {
			return {
				result: await pb.collection<DMs>("dms").getFullList({
					filter: "users.id = '" + pb.authStore.record?.id + "'",
					expand: "users",
					sort: "-created",
				}),
				yourid: pb.authStore.record?.id,
			};
		} catch (error) {
			console.error("Error fetching user chats:", error);
			return status(500);
		}
	})
	.get("/me/userchats/:id/messages", async ({ status, params, headers }) => {
		const pb = await auth(headers.authorization || "");
		try {
		} catch (error) {
			console.error("Error fetching user chat:", error);
			return status(500);
		}
	});

const app = new Elysia()
	.use(cors())
	.use(usersapi)
	.listen(63273, ({ port }) => console.log(`Server is running on http://localhost:${port}`));
export type App = typeof app;
