import type { DMs } from "backend/types.ts";

import VeryRubbishYapperLogo from "../assets/yapper.svg";
import LucideUsers from "../assets/lucide/users.svg";
import LucideChats from "../assets/lucide/chats.svg";

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
		<div class="w-20 h-screen bg-zinc-900 text-gray-300 flex flex-col items-center">
			<div class="flex flex-col items-center mt-4 space-y-4">
				<div>
					<img src={VeryRubbishYapperLogo} alt="yapper logo" class="w-14 h-14 mb-1 rounded-full" />
					<div class="flex mx-auto mb-2">
						<div
							title="Groups"
							class={
								"hover:bg-zinc-700 cursor-pointer w-6 h-6 rounded-lg p-1" +
								(mode === "groups" ? " bg-zinc-800" : "")
							}
							onClick={() => alert("Only DMs available for now.")}>
							<img src={LucideChats} alt="Groups" class="w-4 h-4" />
						</div>
						<div
							title="Messages"
							class={
								"hover:bg-zinc-700 cursor-pointer w-6 h-6 rounded-lg p-1 ml-1" +
								(mode === "messages" ? " bg-zinc-800" : "")
							}
							onClick={() => alert("Only DMs available for now.")}>
							<img src={LucideUsers} alt="Messages" class="w-4 h-4" />
						</div>
					</div>
					<span class="bg-zinc-700 w-8 h-0.5 rounded-4xl block mx-auto"></span>
				</div>
				{dms.map((dm, i) =>
					Array.isArray(dm) ? (
						<div
							key={i}
							title={"Group DM with users: " + dm.map((user) => user.name).join(", ")}
							class="w-14 h-14 rounded-full cursor-pointer hover:opacity-95 focus:outline-none"
							onClick={() => setSelectedDM(dm)}>
							<img src={dm[0].avatar} alt={dm[0].name} class="w-14 h-14 rounded-full" />
						</div>
					) : (
						<button
							title={dm.username}
							key={i}
							class="w-14 h-14 rounded-full cursor-pointer hover:opacity-95 focus:outline-none"
							onClick={() => setSelectedDM(dm)}>
							<img src={dm.avatar} alt={dm.name} class="w-14 h-14 rounded-full" />
						</button>
					),
				)}
			</div>
		</div>
	);
}
