#!/usr/bin/env ts-node

import { Command } from "commander";
import inquirer from "inquirer";
import mysql from "mysql2";
import pg from "pg";
import {
  ConnectionDetails,
  MysqlConnectionDetails,
  PostgresConnectionDetails,
} from "./contracts/ConnectionDetails.interface.js";
import { DB_NAME_SAMPLES } from "./Datas/DBNames.constants.js";
import { DatabaseType } from "./contracts/Database.type.js";
import { askForDBDriver, getBasicQuestions } from "./utils/DB.utils.js";

let currentDbName: string;

const command = new Command();

command.action((cmdObj) => {});

async function testConnection(
  driver: DatabaseType,
  details: ConnectionDetails
): Promise<boolean> {
  switch (driver) {
    case "postgres":
      const pgClient = new pg.Client(details as PostgresConnectionDetails);
      try {
        await pgClient.connect();
        await pgClient.end();
        return true;
      } catch {
        return false;
      }

    case "mysql":
      return new Promise((resolve) => {
        const connection = mysql.createConnection(
          details as MysqlConnectionDetails
        );
        connection.connect((err) => {
          if (err) {
            resolve(false);
          } else {
            connection.end();
            resolve(true);
          }
        });
      });

    default:
      console.log("Driver non supporté");
      return Promise.resolve(false);
  }
}

async function createDatabase(
  driver: DatabaseType,
  details: ConnectionDetails
) {
  switch (driver) {
    case "postgres":
      // Handle PostgreSQL database creation here.
      break;

    case "mysql":
      const connection = mysql.createConnection(
        details as MysqlConnectionDetails
      );
      connection.query(`CREATE DATABASE ${details.dbName}`, (err) => {
        if (err) {
          console.error("Error creating database: " + err.stack);
          return;
        }
        console.log("Database created.");
        currentDbName = details.dbName;
        console.log(`Stored database name: ${currentDbName}`);
        connection.end();
        return currentDbName;
      });
      break;

    default:
      console.log("Driver non supporté");
      break;
  }
}

command
  .command("gen:db")
  .description("Create a new database")
  .action(async () => {
    const driver = await askForDBDriver();

    let connectionDetails: ConnectionDetails;

    do {
      connectionDetails = await inquirer.prompt(getBasicQuestions(driver, currentDbName));
      if (await testConnection(driver, connectionDetails)) break;
      console.log("Erreur de connexion! Veuillez ressaisir vos informations.");
    } while (true);

    await createDatabase(driver, connectionDetails);

    console.log("Database created successfully.");

    const { generateEntity } = await inquirer.prompt({
      type: "confirm",
      name: "generateEntity",
      message: "Do you want to generate an entity?",
      default: false,
    });

    if (generateEntity.value === true) {
      const entityCommand = command.command("gen:table");
      entityCommand.action(() => {
        try {
          connectionDetails.dbName = currentDbName;
          testConnection(driver, connectionDetails);
          console.log("Connection established", { connectionDetails });
        } catch (error) {
          console.error(error);
        }
      });
    }
  });

command.parse(process.argv);
