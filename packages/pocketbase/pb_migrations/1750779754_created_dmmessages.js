/// <reference path="../pb_data/types.d.ts" />
migrate(
	(app) => {
		const collection = new Collection({
			createRule: "@request.body.chat.users = @request.auth.id && @request.body.sender.id = @request.auth.id",
			deleteRule: "sender = @request.auth.id && chat.users = @request.auth.id",
			fields: [
				{
					autogeneratePattern: "[a-z0-9]{15}",
					hidden: false,
					id: "text3208210256",
					max: 15,
					min: 15,
					name: "id",
					pattern: "^[a-z0-9]+$",
					presentable: false,
					primaryKey: true,
					required: true,
					system: true,
					type: "text",
				},
				{
					autogeneratePattern: "",
					hidden: false,
					id: "text4274335913",
					max: 0,
					min: 0,
					name: "content",
					pattern: "",
					presentable: false,
					primaryKey: false,
					required: false,
					system: false,
					type: "text",
				},
				{
					cascadeDelete: false,
					collectionId: "_pb_users_auth_",
					hidden: false,
					id: "relation1593854671",
					maxSelect: 1,
					minSelect: 0,
					name: "sender",
					presentable: false,
					required: false,
					system: false,
					type: "relation",
				},
				{
					hidden: false,
					id: "file1204091606",
					maxSelect: 99,
					maxSize: 0,
					mimeTypes: [],
					name: "attachments",
					presentable: false,
					protected: false,
					required: false,
					system: false,
					thumbs: [],
					type: "file",
				},
				{
					cascadeDelete: false,
					collectionId: "pbc_1282110721",
					hidden: false,
					id: "relation1704850090",
					maxSelect: 1,
					minSelect: 0,
					name: "chat",
					presentable: false,
					required: false,
					system: false,
					type: "relation",
				},
				{
					hidden: false,
					id: "autodate2990389176",
					name: "created",
					onCreate: true,
					onUpdate: false,
					presentable: false,
					system: false,
					type: "autodate",
				},
				{
					hidden: false,
					id: "autodate3332085495",
					name: "updated",
					onCreate: true,
					onUpdate: true,
					presentable: false,
					system: false,
					type: "autodate",
				},
			],
			id: "pbc_3594148832",
			indexes: [],
			listRule: "chat.users = @request.auth.id",
			name: "dmmessages",
			system: false,
			type: "base",
			updateRule:
				"chat.users = @request.auth.id && @request.body.sender = @request.auth.id && sender = @request.auth.id",
			viewRule: "chat.users = @request.auth.id",
		});

		return app.save(collection);
	},
	(app) => {
		const collection = app.findCollectionByNameOrId("pbc_3594148832");

		return app.delete(collection);
	},
);
