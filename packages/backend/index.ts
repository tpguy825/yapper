Bun.serve({
	routes: {
		"/": () => new Response("Hi!"),
		
	}
})