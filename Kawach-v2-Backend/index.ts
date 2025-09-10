import 'module-alias/register';
import dotenv from "dotenv";
dotenv.config();

import promBundle from "express-prom-bundle";

import express, {Request, Response, NextFunction} from "express";
import "./lib/firebase.admin";
import sequelize from "./lib/seq.js"; // This is to prevent error from TypeScript. Don't use a @lib alias.
import WrappedError from "./error/wrapped.error.js";
import authRouter from "./routers/auth.router.js";
import userRouter from "./routers/user.router.js";
import contactRouter from "./routers/contact.router.js";
import policeStationRouter from "./routers/police.station.router.js";
import ticketRouter from "./routers/ticket.router.js";
import cors from "cors";

const app = express();
// Setup Logging Middleware for Prometheus
const metricsMiddleware = promBundle({
  includeMethod: true,
  includePath: true,
  includeStatusCode: true,
});

app.use(metricsMiddleware);

const PORT = Number(process.env.PORT) || 8080;

// MIDDLEWARES
app.use(cors({origin: "*"})); // Allow all origins
app.use(express.json());

// ERROR HANDLING MIDDLEWARE
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  if (err instanceof WrappedError) {
    res.status(err.code).json({ message: err.message, original_error: err.originalError });
  } else {
    res.status(500).json({ message: "Internal server error", error: err });
  }
  return;
});

// SECTION: ROUTERS
app.use("/v2/auth", authRouter);
app.use("/v2/user", userRouter);
app.use("/v2/user/:user_id/contacts", contactRouter);
app.use("/v2/police-stations", policeStationRouter);  
app.use("/v2/user/:user_id/ticket", ticketRouter);

// Health Check
app.get("/health-check", (_: Request, res: Response) => {
  res.status(200).json({ message: "Server is healthy" });
  return;
});


// Sync DB Before starting the server
sequelize.sync({alter: process.env.NODE_ENV === "development"}).then(() => {
  console.log("Models synced with database");
}).catch((err) => {
  console.error(err);
  throw new Error("Unable to sync models with database");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


