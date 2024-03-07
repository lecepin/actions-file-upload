import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyMultipart from "fastify-multipart";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { existsSync, mkdirSync, createWriteStream } from "fs";
import { pipeline } from "stream";
import { promisify } from "util";

const pump = promisify(pipeline);
const __dirname = dirname(fileURLToPath(import.meta.url));

const fastify = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
    },
  },
});

fastify.register(fastifyStatic, {
  root: join(__dirname, "public"),
  prefix: "/",
});

fastify.register(fastifyMultipart);

fastify.post("/upload", async (request, reply) => {
  const data = await request.file();
  const filename = data.filename;
  const saveTo = join(__dirname, "public", "uploads", filename);

  if (!existsSync(join(__dirname, "public", "uploads"))) {
    mkdirSync(join(__dirname, "public", "uploads"));
  }

  await pump(data.file, createWriteStream(saveTo));
  reply.send({ message: "File uploaded successfully", filename: filename });
});

const start = async () => {
  try {
    await fastify.listen(3003);
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
