import { defineRailway, github, image, project, service, volume } from "railway/iac";

export const partial = "plant-observation";

export default defineRailway((ctx) => {
  const storage = volume("anythingllm-storage");
  const anythingllm = service("anythingllm", {
    source: image("mintplexlabs/anythingllm:railway-1.20.0"),
    env: {
      PORT: "3001",
      SERVER_PORT: "3001",
      STORAGE_DIR: "/storage",
    },
    healthcheck: "/api/ping",
    volumeMounts: {
      "/storage": storage,
    },
  });

  const web = service("plant-observation", {
    source: github("echyyn1019-svg/-AI-", { branch: "main" }),
    start: "npm start",
    healthcheck: "/",
    env: {
      ANYTHINGLLM_URL: "http://${{anythingllm.RAILWAY_PRIVATE_DOMAIN}}:3001",
    },
  });

  return project(ctx.projectName || "plant-observation", {
    resources: [web, anythingllm, storage],
  });
});
