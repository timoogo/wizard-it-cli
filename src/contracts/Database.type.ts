import { MysqlConnectionDetails, PostgresConnectionDetails } from "./ConnectionDetails .interface.js";

export type DatabaseType = 'postgres' | 'mysql';
type ConnectionDetails = MysqlConnectionDetails | PostgresConnectionDetails;
