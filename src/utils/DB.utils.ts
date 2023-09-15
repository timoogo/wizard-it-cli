import inquirer from "inquirer";
import { DatabaseType } from "../contracts/Database.type.js";
import mysql from 'mysql2/promise';

import { DB_NAME_SAMPLES } from "../Datas/DBNames.constants.js";
import { ConnectionDetails, PostgresConnectionDetails } from "../contracts/ConnectionDetails .interface.js";

import pkg from 'pg';
const { Client: PGClient } = pkg;

export async function askForDBDriver(): Promise<DatabaseType> {
    const { driver } = await inquirer.prompt({
        type: 'list',
        name: 'driver',
        message: 'Select a database driver',
        choices: ['postgres', 'mysql']
    });

    return driver;
}


export async function connectToDB(connectionDetails: ConnectionDetails, databaseType: DatabaseType): Promise<any> {
    if (databaseType === 'postgres') {
        const client = new PGClient(connectionDetails);
        await client.connect();
        return client;
    } else if (databaseType === 'mysql') {
        const connection = await mysql.createConnection(connectionDetails);
        return connection;
    } else {
        throw new Error("Unsupported database type");
    }
}


export function getRandomDbName(): string {
    const randomIndex = Math.floor(Math.random() * DB_NAME_SAMPLES.length);
    return DB_NAME_SAMPLES[randomIndex];
}

export function getBasicQuestions(driver: DatabaseType) {
    const defaults: Record<DatabaseType, string> = {
        'postgres': '5432',
        'mysql': '3306'
    };

    return [
        {
            type: 'input',
            name: 'host',
            message: 'Database host:',
            default: 'localhost'
        },
        {
            type: 'input',
            name: 'port',
            message: 'Port:',
            default: defaults[driver],
            validate: (value: string) => {
                const valid = !isNaN(parseFloat(value));
                return valid || 'Please enter a valid port number.';
            },
            filter: Number
        },
        {
            type: 'input',
            name: 'dbName',
            message: 'Name of the database to create:',
            default: getRandomDbName()
        },
        {
            type: 'input',
            name: driver === 'mysql' ? 'user' : 'username',
            message: 'Username:'
        },
        {
            type: 'password',
            name: 'password',
            message: 'Password:',
        }
    ];
}
