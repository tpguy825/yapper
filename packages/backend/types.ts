import type { RecordModel } from "pocketbase";

interface FullRecordModel extends RecordModel {
	/** Date represented in ISO 8601 datetime format */
	created: string;
	/** Date represented in ISO 8601 datetime format */
	updated: string;
}

export interface User extends FullRecordModel {
	name: string;
	avatar: string;
	username: string;
}

export interface DMs extends FullRecordModel {
	users: string[];
	expand: {
		users: User[]; // one of them is you
	};
	created: string;
	updated: string;
}

export interface DMMessages extends FullRecordModel {
	sender: string; // ID of the user who sent the message
	chat: string; // ID of DM it was sent to
	content: string; // text content of message
	// attachments?: string[]; // unused
	expand: {
		sender: User;
	};
}