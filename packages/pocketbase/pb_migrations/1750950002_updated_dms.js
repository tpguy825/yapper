/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1282110721")

  // update collection data
  unmarshal({
    "listRule": "users ~ @request.auth.id && @request.auth.id != \"\"",
    "viewRule": "users ~ @request.auth.id && @request.auth.id != \"\""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1282110721")

  // update collection data
  unmarshal({
    "listRule": "users = @request.auth.id && @request.auth.id != \"\"",
    "viewRule": "users = @request.auth.id && @request.auth.id != \"\""
  }, collection)

  return app.save(collection)
})
