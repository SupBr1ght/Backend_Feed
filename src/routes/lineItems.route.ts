import { FastifyInstance } from "fastify"

const lineItemRoutes = async (fastify: FastifyInstance) => {
    fastify.get("/line-items", async (_req, reply) => {
        const items = await fastify.prisma.lineItem.findMany()
        return reply.react("App", { items })
    })


    fastify.post("/line-items", async (req, reply) => {
        const parts = req.parts()
        let data: any = {}

        for await (const part of parts) {
            if (part.file) {
                const filename = Date.now() + "_" + part.filename
                const filepath = `public/creatives/${filename}`
                await part.toFile(filepath)
                data.creativeUrl = `/public/creatives/${filename}`
            } else {
                data[part.fieldname] = part.value
            }
        }

        await fastify.prisma.lineItem.create({ data })
        return reply.redirect("/line-items")
    })
}

export default lineItemRoutes
