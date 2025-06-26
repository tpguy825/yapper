import type { RecordModel } from "pocketbase";

export interface User extends RecordModel {
	name: string;
	avatar: string;
	username: string;
}

export interface DMs extends RecordModel {
	users: string[];
	expand: {
		users: User[]; // one of them is you
	};
	created: string;
	updated: string;
}
