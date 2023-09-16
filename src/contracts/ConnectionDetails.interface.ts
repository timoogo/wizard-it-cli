export interface ConnectionDetails {
    host: string;
    port: number;
    username?: string;
    user?: string;
    password: string;
    dbName: string;
}
export interface MysqlConnectionDetails {
    host: string;
    port: number;
    user: string;
    password: string;
    dbName: string;
}

export interface PostgresConnectionDetails {
    host: string;
    port: number;
    username: string;
    password: string;
    dbName: string;
}