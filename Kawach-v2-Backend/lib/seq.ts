import userdata from "@/models/user.data.model";
import user_permission from "@/models/user.permission.model";
import emergency_contact from "@/models/emergency.contact.model";
import ticket_data from "@/models/ticket.data.model";
import police_station from "@/models/police.station.model";
import { Sequelize } from "sequelize-typescript";
import process from "node:process";


if (!process.env.DB_URL) {
  throw new Error(`DB_URL env variable must be set`);
}

/**
 * An instance of Sequelize configured to interact with a MySQL database.
 *
 * This instance is initialized with the following configuration:
 * - `dialect`: Specifies the SQL dialect being used (for example, MySQL).
 * - `host`: The hostname or IP address of the database server, provided through `process.env.DB_HOST`.
 * - `port`: The port number used to connect to the database server, derived from `process.env.DB_PORT`.
 * - `username`: The username for authenticating with the database, provided through `process.env.DB_USER`.
 * - `password`: The password corresponding to the database username, provided through `process.env.DB_PASSWORD`.
 * - `database`: The name of the database to connect to, specified using `process.env.DB_NAME`.
 * - `logging`: Indicates whether SQL query logging is enabled.
 * In this configuration, it is set to `false` to disable logging.
 * - `models`: An array of model instances representing database tables.
 * In this configuration, it includes:
 *   `userdata`, `user_permission`, `emergency_contact`, `ticket_data`, and `police_station`.
 *
 * The created Sequelize instance serves as an ORM (Object Relational Mapping)
 * tool to interact with the database using the configured models.
 */
const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: "postgres",
  logging: false,
  models: [userdata, user_permission, emergency_contact, ticket_data, police_station]
});

sequelize.authenticate().then(() => {
  console.log("Connection has been established successfully.");
}).catch((err) => {
    console.error(err);
    throw new Error("Unable to connect to the database: Authentication failed");
});

export default sequelize;
