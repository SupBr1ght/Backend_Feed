import { PrismaClient } from "@prisma/client";
import { processAllFeeds } from "./ feedParser.service";

const prisma = new PrismaClient();

(async () => {
    const res = await processAllFeeds(prisma);
    console.log(res);
    await prisma.$disconnect();
})();