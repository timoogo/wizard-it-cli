import inquirer from 'inquirer';
import { DatabaseType } from '../contracts/Database.type.js';
import { ConnectionDetails } from '../contracts/ConnectionDetails.interface.js';
import mysql from 'mysql2/promise';

export async function askForDBDriver(): Promise<DatabaseType> {
    const answers = await inquirer.prompt({
        type: 'list',
        name: 'driver',
        message: 'Choose a database driver:',
        choices: ['mysql', 'postgres']
    });
    return answers.driver;
}

export async function askForDBName(): Promise<string> {
    const answers = await inquirer.prompt({
        type: 'input',
        name: 'dbName',
        message: 'Enter the name of the database you want to connect to:'
    });
    return answers.dbName;
}

export function getBasicQuestions(driver: DatabaseType, dbName: string): any[] {
    return [
        {
            type: 'input',
            name: 'host',
            message: 'Enter the host:'
        },
        {
            type: 'input',
            name: 'user',
            message: 'Enter the user:'
        },
        {
            type: 'password',
            name: 'password',
            message: 'Enter the password:'
        },
        {
            type: 'input',
            name: 'database',
            message: 'Enter the database:',
            default: dbName
        }
    ];
}

export async function connectToDB(connectionDetails: ConnectionDetails, driver: DatabaseType): Promise<mysql.Connection | undefined> {
    if (driver === 'mysql') {
        return await mysql.createConnection(connectionDetails);
    } else if (driver === 'postgres') {
        // Postgres connection logic here
    }
    return undefined;
}