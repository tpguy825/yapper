import type { DMMessages as DMMessage, DMs } from "backend/types";
import { pb } from "../main";
import { useEffect, useState } from "preact/hooks";

import LucideSend from "../assets/lucide/send.svg";
import LucideImagePlus from "../assets/lucide/image-plus.svg";



export function Messages({ selectedDM }: { selectedDM: DMs | null }) {
	const [messages, setMessages] = useState<DMMessage[]>([]);
	const [typingmessage, setTypingMessage] = useState<string>("");

	useEffect(() => {
		if (window.dm_message_unsubscribe) {
			window.dm_message_unsubscribe();
			window.dm_message_unsubscribe = null;
		}
		if (selectedDM) {
			pb.collection<DMMessage>("dmmessages")
				.getFullList({
					filter: `chat = "${selectedDM.id}"`,
					sort: "-created",
					expand: "sender",
				})
				.then(async (response) => {
					setMessages(response);

					const unsubscribe = await pb.collection<DMMessage>("dmmessages").subscribe(
						"*",
						(e) => {
							if (!selectedDM) {
								if (window.dm_message_unsubscribe) {
									window.dm_message_unsubscribe();
									window.dm_message_unsubscribe = null;
								}
								return;
							}

							if (e.record.chat !== selectedDM.id) return;

							if (e.action === "create") {
								setMessages((prevMessages) =>
									[...prevMessages, e.record].sort(
										(a, b) => new Date(a.created).getTime() - new Date(b.created).getTime(),
									),
								);
							} else if (e.action === "delete") {
								setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== e.record.id));
							} else if (e.action === "update") {
								setMessages((prevMessages) => {
									const index = prevMessages.findIndex((msg) => msg.id === e.record.id);
									if (index !== -1) {
										const updatedMessages = [...prevMessages];
										updatedMessages[index] = e.record;
										return updatedMessages.sort(
											(a, b) => new Date(a.created).getTime() - new Date(b.created).getTime(),
										);
									}
									return prevMessages;
								});
							}
						},
						{ filter: `chat = "${selectedDM.id}"`, expand: "sender" },
					);
					window.dm_message_unsubscribe = unsubscribe;
				})
				.catch((error) => {
					console.error("Error fetching messages:", error);
				});
		}
	}, [selectedDM]);

	function sendMessage() {
		if (typingmessage.trim() === "") return;
		pb.collection<DMMessage>("dmmessages")
			.create({
				content: typingmessage,
				chat: selectedDM?.id || "",
				sender: pb.authStore.record?.id || "",
			})
			.then(() => {
				setTypingMessage("");
			})
			.catch((error) => {
				console.error("Error sending message:", error);
			});
	}

	return (
		// main messages container + textbox
		selectedDM ? (
			<div class="flex flex-col w-full bg-zinc-950 h-screen">
				<div class="flex flex-row w-full h-16 items-center pt-2 pl-2">
					<h2 class="text-zinc-200 h-5 flex ml-2 font-extrabold text-xl">
						<img
							src={pb.files.getURL(selectedDM.expand.users[0], selectedDM.expand.users[0].avatar, {
								thumb: "44x44",
							})}
							alt={selectedDM.expand.users[0].name}
							class="w-8 h-8 rounded-full mr-2"
						/>
						<p class="ml-1">{selectedDM.expand.users.map((user) => user.username).join(", ")}</p>
					</h2>
					{/* <span class="text-zinc-500 ml-4 text-sm mt-1">{channel.description}</span> */}
				</div>
				{messages.length === 0 ? (
					<div class="flex flex-col w-full h-full items-center justify-center">
						<span class="text-zinc-500">It's rather quiet in here...</span>
					</div>
				) : (
					""
				)}
				<ul class="flex flex-col w-full h-full overflow-y-auto p-2">
					{messages
						.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime())
						.map((message, i) => (
							<MessageItem
								message={message}
								compact={
									messages[i - 1] &&
									new Date(message.created).getTime() - new Date(messages[i - 1].created).getTime() <
										5 * 60 * 1000 &&
									messages[i - 1].sender === message.sender
								}
							/>
						))}
				</ul>
				<div class="w-full p-4">
					<div class="flex flex-row w-full h-12 bg-zinc-800 rounded-xl border focus-within:border-zinc-600 border-zinc-700">
						<button
							class="text-zinc-400 p-2 px-4 hover:bg-zinc-700 hover:text-blue-400 cursor-pointer rounded-l-lg"
							onClick={() => alert("Does nothing lmao might do something soon")}>
							<img src={LucideImagePlus} class="h-5 w-5" />
						</button>
						{/* <input
							type="text"
							id="mainmessageinput"
							placeholder="Type a message..."
							class="w-full h-12 p-2 text-white focus:outline-none"
							value={typingmessage}
							onInput={(e) => setTypingMessage((e.target as HTMLInputElement).value)}
							onKeyDown={(e) => {
						/> */}
						<textarea
							id="mainmessageinput"
							placeholder="Type a message..."
							class="w-full h-12 p-2 text-white focus:outline-none bg-transparent resize-none"
							value={typingmessage}
							onInput={(e) => setTypingMessage((e.target as HTMLTextAreaElement).value)}
							onKeyDown={(e) => {
								if (e.key === "Enter" && !e.shiftKey) {
									e.preventDefault();
									sendMessage();
								}
							}}
							rows={Math.min(5, typingmessage.split("\n").length)}
						/>
						<button
							class="text-zinc-400 hover:text-blue-400 rounded-r-lg p-2 px-4 hover:bg-zinc-700 cursor-pointer"
							onClick={sendMessage}>
							<img src={LucideSend} class="h-5 w-5" />
						</button>
					</div>
				</div>
			</div>
		) : (
			<div class="text-center text-zinc-500">Select a DM to start chatting.</div>
		)
	);
}

function MessageItem({ message, compact }: { message: DMMessage; compact: boolean }) {
	const [hovered, setHovered] = useState(false);
	return (
		<li
			class={
				"a flex flex-row ml-2 p-2 rounded-lg " +
				(compact ? "py-0.5" : "mt-1 pb-1 -mb-1") +
				(hovered ? " bg-zinc-800" : "")
			}
			onMouseOver={() => setHovered(true)}
			onMouseOut={() => setHovered(false)}>
			{compact ? (
				<div class="min-w-10 mr-2"></div>
			) : (
				<img
					src={
						message.expand && message.expand.sender && message.expand.sender.avatar
							? pb.files.getURL(message.expand.sender, message.expand.sender.avatar, { thumb: "44x44" })
							: ""
					}
					alt={message.sender}
					class="h-10 w-10 rounded-full mr-2"
				/>
			)}
			<div class="flex flex-col ml-1">
				{compact ? (
					""
				) : (
					<span class="text-zinc-200 text-lg font-bold flex -mt-1">
						{message.expand.sender.name || message.expand.sender.username}{" "}
						<span class="text-zinc-500 text-xs ml-2 my-auto">{date(new Date(message.created))}</span>
					</span>
				)}
				<span class="text-zinc-400 text-lg">{message.content}</span>
			</div>
		</li>
	);
}

function date(time: Date) {
	const now = new Date();
	if (now.getFullYear() !== time.getFullYear() || now.getMonth() !== time.getMonth())
		return df(time, "{h}:{m} {d}/{mo}/{y}");
	if (now.getDate() - time.getDate() === 1) return df(time, "Yesterday at {h}:{m}");
	if (now.getDate() === time.getDate()) return df(time, "{h}:{m}");
	else return df(time, "{h}:{m} {d}/{mo}/{y}");
}

function df(now: Date, format: string) {
	return format
		.replace("{h}", String(now.getHours()).padStart(2, "0"))
		.replace("{m}", String(now.getMinutes()).padStart(2, "0"))
		.replace("{d}", String(now.getDate()).padStart(2, "0"))
		.replace("{mo}", String(now.getMonth() + 1).padStart(2, "0"))
		.replace("{y}", String(now.getFullYear()));
}
