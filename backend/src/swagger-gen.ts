import path from "path";
import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Dating App API",
    description: "Auto-generated API documentation",
    version: "1.0.0",
  },
  host: "localhost:8090",
  basePath: "/v1/api",
  schemes: ["http", "https"],
  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
    },
  },
};

const outputFile = path.join(__dirname, "..", "swagger-output.json");
const endpointsFiles = [path.join(__dirname, "app", "routes", "index.ts")];

async function generate() {
  console.log("Output will be written to:", outputFile);
  await swaggerAutogen()(outputFile, endpointsFiles, doc);
  console.log("✅ Swagger docs generated");
}

generate();
