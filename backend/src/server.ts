import http from "http";
import mongoose from "mongoose";
import app from "./app";
import config from "./app/config";
import { initSocket } from "./app/config/socket";
import { startSubscriptionCleanupScheduler } from "./app/modules/schedulers/cleanupSchedulers";

async function main() {
  try {
    await mongoose.connect(config.database_url as string);

    const httpServer = http.createServer(app);
    initSocket(httpServer);

    httpServer.listen(config.port, () => {
      console.log(`server is running on ports ${config.port}`);
      startSubscriptionCleanupScheduler(30 * 60 * 1000);
    });
  } catch (err) {
    console.log(err);
  }
}

main();
