import cors from "cors";
import express from "express";
import { initRoutes } from "./routes/routes.js";

import "./config/db.js";

/* 
CORS configuration to expose auth tokens used programatically
(check client/src/services/requestHelper.js) in further requests once they appear
*/
const corsOptions = {
  exposedHeaders: ["x-access-token", "x-user-id"],
};

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initRoutes(app);

app.use("/", express.static("./client/build"));

const port = 3333;
app.listen(port, () => {
  console.info("Server listening on port", port);
});

export { app };
