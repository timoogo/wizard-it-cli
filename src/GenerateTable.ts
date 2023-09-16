import { DatabaseType } from './contracts/Database.type.js';
import { askForDBDriver, connectToDB, getBasicQuestions, askForDBName } from './utils/DB.utils.js';
import { Command } from 'commander';
import inquirer from 'inquirer';
import mysql from 'mysql2/promise';
import { ConnectionDetails } from './contracts/ConnectionDetails.interface.js';

const command = new Command();

command
    .command('gen:table')
    .description('Generate a new table')
    .action(async () => {
        const driver: DatabaseType = await askForDBDriver();
        const dbName: string = await askForDBName();
        const connectionDetails: ConnectionDetails = await inquirer.prompt(getBasicQuestions(driver, dbName));

        let dbConnection: mysql.Connection | undefined;

        try {
            if (driver === 'mysql') {
                dbConnection = await connectToDB(connectionDetails, driver) as unknown as mysql.Connection;
            } else if (driver === 'postgres') {
                dbConnection = await connectToDB(connectionDetails, driver) as unknown as mysql.Connection;
            }
        } catch (error) {
            console.error('Failed to connect to the database. Please check your connection details.');
            return;
        }

        let tableName: string;
        let columns: string[] = [];
        let addAnotherColumn = true;

        const tableNameAnswer = await inquirer.prompt({
            type: 'input',
            name: 'tableName',
            message: 'Enter table name:'
        });
        tableName = tableNameAnswer.tableName;

        // Ajouter automatiquement la colonne 'id' comme clé primaire, non null, et auto-incrémentée
        columns.push('id INT NOT NULL AUTO_INCREMENT PRIMARY KEY');
        
        while (addAnotherColumn) {
            const columnDetails = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'columnName',
                    message: 'Entrez le nom de la colonne (laissez vide pour terminer):'
                },
                {
                    type: 'list',
                    name: 'dataType',
                    message: 'Choisissez le type de données pour la colonne:',
                    choices: ['INT', 'VARCHAR', 'TEXT', 'DATE', 'TIMESTAMP', 'FLOAT', 'DOUBLE', 'BOOLEAN']
                },
                {
                    type: 'input',
                    name: 'length',
                    message: 'Entrez la longueur/taille de la colonne (laissez vide pour la taille par défaut):'
                },
                {
                    type: 'checkbox',
                    name: 'constraints',
                    message: 'Choisissez les contraintes pour la colonne:',
                    choices: ['PRIMARY KEY', 'UNIQUE', 'NOT NULL', 'AUTO_INCREMENT']
                },
                {
                    type: 'input',
                    name: 'defaultValue',
                    message: 'Entrez la valeur par défaut pour la colonne (laissez vide si non applicable):'
                },
                {
                    type: 'input',
                    name: 'foreignKey',
                    message: 'Entrez la clé étrangère pour la colonne (laissez vide si non applicable):'
                },
                {
                    type: 'input',
                    name: 'index',
                    message: 'Entrez l’index pour la colonne (laissez vide si non applicable):'
                },
                {
                    type: 'input',
                    name: 'autoIncrement',
                    message: 'La colonne doit-elle s’auto-incrémenter? (oui/non)',
                },
                {
                    type: 'input',
                    name: 'comments',
                    message: 'Entrez les commentaires/description pour la colonne (laissez vide si non applicable):'
                }
            ]);
        
            if (columnDetails.columnName) {
                columns.push(`${columnDetails.columnName} ${columnDetails.dataType}${columnDetails.length ? '(' + columnDetails.length + ')' : ''} ${columnDetails.constraints.join(' ')}${columnDetails.defaultValue ? ' DEFAULT ' + columnDetails.defaultValue : ''}${columnDetails.autoIncrement === 'oui' ? ' AUTO_INCREMENT' : ''}`);
        
                const { continueAdding } = await inquirer.prompt({
                    type: 'confirm',
                    name: 'continueAdding',
                    message: 'Voulez-vous ajouter une autre colonne?'
                });
                addAnotherColumn = continueAdding;
            } else {
                addAnotherColumn = false;
            }
        }
        
        console.log('Résumé des colonnes:');
        columns.forEach(column => {
            console.log(`- ${column}`);
        });
        
        if (driver === 'mysql' && dbConnection) {
            await dbConnection.query(`CREATE TABLE ${tableName} (${columns.join(', ')})`);
        } else if (driver === 'postgres' && dbConnection) {
            // (code pour postgres, quand vous ajouterez le support pour celui-ci)
        }
        
        console.log(`Table ${tableName} créée avec succès.`);

        // ask if we want to create another table
        const { createAnotherTable } = await inquirer.prompt({
            type: 'confirm',
            name: 'createAnotherTable',
            message: 'Voulez-vous créer une autre table?'
        });
        if (createAnotherTable) {
            command.command('gen:table');
        } else {
            process.exit(0);
        }
        
    });

command.parse(process.argv);
