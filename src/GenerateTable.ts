import { DatabaseType } from "./contracts/Database.type.js";
import { askForDBDriver, connectToDB, getBasicQuestions } from './utils/DB.utils.js';
import { Command } from "commander";
import inquirer from "inquirer";
import mysql from 'mysql2/promise';
import { ConnectionDetails } from "./contracts/ConnectionDetails .interface.js";

const command = new Command();

command
    .command('gen:table')
    .description('Generate a new table')
    .action(async ({ driver, connectionDetails }: { driver: DatabaseType, connectionDetails: ConnectionDetails }) => {
        let dbConnection: mysql.Connection | undefined; // Déclarez dbConnection avec le bon type

        if (driver === 'mysql') {
            dbConnection = await connectToDB(connectionDetails, driver) as unknown as mysql.Connection;
        } else if (driver === 'postgres') {
            // Utilisez le type approprié pour le client PostgreSQL
            // dbConnection = await connectToDB(connectionDetails, driver) as VotreTypeDeClientPostgreSQL;
        }

        let tableName: string;
        let columns: string[] = [];

        do {
            const tableNameAnswer = await inquirer.prompt({
                type: 'input',
                name: 'tableName',
                message: 'Enter table name:'
            });
            tableName = tableNameAnswer.tableName; // Extract the string value

            let columnName: string;
            do {
                const columnNameAnswer = await inquirer.prompt({
                    type: 'input',
                    name: 'columnName',
                    message: 'Enter column name (leave blank to finish):'
                });
                columnName = columnNameAnswer.columnName; // Extract the string value
                if (columnName) columns.push(columnName);
            } while (columnName);

            if (driver === 'mysql' && dbConnection) {
                await dbConnection.query(`CREATE TABLE ${tableName} (${columns.join(', ')})`);
            } else if (driver === 'postgres' && dbConnection) {
                // Utilisez le client PostgreSQL avec le type correct ici
                // await dbConnection.query(`CREATE TABLE ${tableName} (${columns.join(', ')})`);
            }

            console.log(`Table ${tableName} created successfully.`);
        } while (true);
    });

command.parse(process.argv);
