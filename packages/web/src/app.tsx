import { useEffect, useState } from "preact/hooks";
import { Sidebar } from "./components/sidebar";
import type { DMs } from "backend/types.ts";
import { pb } from "./main";
import { LocationProvider, Route, Router } from "preact-iso";

import GithubIcon from "./assets/lucide/github.svg";
import { Messages } from "./components/messages";

export function MainApp() {
	const [DMs, setDMs] = useState<DMs[] | null>(null);
	const [selectedDM, setSelectedDM] = useState<DMs | null>(null);

	useEffect(() => {
		if (!pb.authStore.isValid) {
			window.location.href = "/login";
			return;
		}
		try {
			pb.collection<DMs>("dms")
				.getFullList({
					filter: `users ~ "${pb.authStore.record?.id}"`,
					expand: "users",
					sort: "-created",
				})
				.then((response) => {
					setDMs(
						response.map((d) => {
							return {
								...d,
								expand: {
									users: d.expand.users.filter((user) => user.id !== pb.authStore.record?.id),
								},
							};
						}),
					);
				})
				.catch((error) => {
					console.error("Error fetching users:", error);
					window.location.href = "/login";
				});
		} catch (error) {
			console.error("Failed to fetch users:", error);
			window.location.href = "/login";
		}
	}, []);

	return DMs ? (
		<div class="flex h-screen noanim">
			<Sidebar dms={DMs} setSelectedDM={setSelectedDM} mode="messages" />
			<Messages selectedDM={selectedDM} />
		</div>
	) : null;
}

export function App() {
	return (
		<LocationProvider>
			<Router>
				<Route path="/" component={MainApp} />
				<Route path="/login" component={Login} />
				{/* <Route path="/" default component={} /> */}
			</Router>
		</LocationProvider>
	);
}

export function Login() {
	useEffect(() => {
		if (pb.authStore.isValid) {
			window.location.href = "/";
		}
	}, []);

	return (
		<div class="flex h-screen w-screen bg-black text-zinc-300">
			<div class="flex flex-col m-auto">
				<button
					class="rounded-lg border border-zinc-700 flex items-center justify-center cursor-pointer bg-black hover:bg-zinc-900 text-zinc-300 font-semibold py-2 px-4"
					onClick={() => {
						pb.collection("users")
							.authWithOAuth2({ provider: "github" })
							.then(() => {
								window.location.href = "/";
							})
							.catch((error) => {
								console.error("GitHub login failed:", error);
								alert("Login failed. Please try again.");
							});
					}}>
					<img src={GithubIcon} alt="Github icon" class="my-auto inline-block mr-2" />
					Log in with GitHub
				</button>
			</div>
		</div>
	);
}
