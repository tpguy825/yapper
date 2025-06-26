/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3594148832")

  // update collection data
  unmarshal({
    "createRule": "chat.users ~ @request.auth.id && sender.id = @request.auth.id",
    "listRule": "chat.users ~ @request.auth.id",
    "viewRule": "chat.users ~ @request.auth.id"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3594148832")

  // update collection data
  unmarshal({
    "createRule": "@request.body.chat.users = @request.auth.id && @request.body.sender.id = @request.auth.id",
    "listRule": "chat.users = @request.auth.id",
    "viewRule": "chat.users = @request.auth.id"
  }, collection)

  return app.save(collection)
})
