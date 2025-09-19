import Fastify from "fastify";

// create instance of Fastify
const app = Fastify();

// app.get("/", (req, reply) => reply.send("Hello world!"));
app.get("/", async () => "Hello world!");

app.listen({ port: 3000 }, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server listening at ${address}`);
});
