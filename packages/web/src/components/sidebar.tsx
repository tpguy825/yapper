import type { DMs } from "backend/types.ts";

import VeryRubbishYapperLogo from "../assets/yapper.svg";
import LucideUsers from "../assets/lucide/users.svg";
import LucideChats from "../assets/lucide/chats.svg";
import { eden, pb } from "../main";

export function Sidebar({
	dms,
	setSelectedDM,
	mode,
}: {
	mode: "messages" | "groups";
	dms: DMs[];
	setSelectedDM: (dm: DMs | null) => void;
}) {
	return (
		<div class="w-16 min-w-16 h-screen noanim bg-zinc-900 text-zinc-300 flex flex-col items-center">
			<div class="flex flex-col items-center mt-2 space-y-3">
				<div>
					<img src={VeryRubbishYapperLogo} alt="yapper logo" class="w-12 h-12 rounded-full" />
					<div class="flex mx-auto mb-4">
						<div
							title="Groups"
							class={
								"hover:bg-zinc-700 cursor-pointer w-5.5 h-5.5 rounded-lg p-1" +
								(mode === "groups" ? " bg-zinc-800" : "")
							}
							onClick={() => alert("Only DMs available for now.")}>
							<img src={LucideChats} alt="Groups" class="w-4 h-4" />
						</div>
						<div
							title="Messages"
							class={
								"hover:bg-zinc-700 cursor-pointer w-5.5 h-5.5 rounded-lg p-1 ml-1" +
								(mode === "messages" ? " bg-zinc-800" : "")
							}
							onClick={() => alert("Only DMs available for now.")}>
							<img src={LucideUsers} alt="Messages" class="w-4 h-4" />
						</div>
					</div>
					<span class="bg-zinc-700 w-8 h-0.5 rounded-4xl block mx-auto"></span>
				</div>
				{dms.map((dm, i) =>
					dm.users.length > 2 ? (
						<div
							key={i}
							title={"Group DM with users: " + dm.expand.users.map((user) => user.username).join(", ")}
							class="w-14 h-14 rounded-full cursor-pointer hover:opacity-95 focus:outline-none"
							onClick={() => setSelectedDM(dm)}>
							<img src={dm[0].avatar} alt={dm[0].name} class="w-11 h-11 mx-auto rounded-full" />
						</div>
					) : (
						<button
							title={dm.expand.users[0].username}
							key={i}
							class="w-14 h-14 rounded-full cursor-pointer hover:opacity-95 focus:outline-none"
							onClick={() => setSelectedDM(dm)}>
							<img
								src={pb.files.getURL(dm.expand.users[0], dm.expand.users[0].avatar, {thumb: "44x44"})}
								alt={dm.expand.users[0].name}
								class="w-11 h-11 rounded-full mx-auto"
							/>
						</button>
					),
				)}
				<button
					title="New DM"
					class="w-11 h-11 rounded-full cursor-pointer hover:opacity-95 focus:outline-none bg-zinc-700 flex items-center justify-center"
					onClick={() => {
						const username = prompt("Enter the username of the user you want to DM:");
						if (!pb.authStore.isValid) {
							alert("You must be logged in to create a DM.");
							window.location.href = "/login";
							return;
						}
						if (!username?.trim()) {
							alert("Username cannot be empty.");
							return;
						}
						eden.me.createDM
							.post({ username: username.trim() }, { headers: { Authorization: pb.authStore.token } })
							.then((newDM) => {
								if (newDM.status === 200) {
									setSelectedDM(newDM.data);
								} else {
									console.error(
										"Failed to create DM:",
										(
											newDM.data as unknown as (typeof newDM.response)[Exclude<
												keyof typeof newDM.response,
												200
											>]
										).message,
									);
									alert(
										"Failed to create DM: " +
											(
												newDM.data as unknown as (typeof newDM.response)[Exclude<
													keyof typeof newDM.response,
													200
												>]
											).message,
									);
								}
							})
							.catch((error) => {
								console.error("Error creating DM:", error);
								alert("Failed to create DM. Please try again.");
							});
					}}>
					<img src={LucideUsers} alt="New DM" class="w-6 h-6" />
				</button>
			</div>
		</div>
	);
}
