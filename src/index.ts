#!/usr/bin/env ts-node


import { Command } from "commander";
import pg from "pg";
import inquirer from "inquirer";
import select from '@inquirer/select';
import ExtendedCommand from "./ExtandedCommand.js";



const command = new ExtendedCommand();
const basicQuestions = [
    {
        type: 'input',
        isVisible: true,
        name: 'host',
        message: 'Hôte de la base de données:',
        default: 'localhost'
    },
    {
        type: 'input',
        isVisible: true,
        name: 'port',
        message: 'Port:',
    },
    {
        type: 'input',
        isVisible: true,
        name: 'username',
        message: 'Nom d\'utilisateur:',
    },
    {
        type: 'password',
        isVisible: true,
        name: 'password',
        message: 'Mot de passe:',
    },
    {
        type: 'input',
        isVisible: true,
        name: 'dbName',
        message: 'Nom de la base de données à créer:',
    },
    {
        type: 'confirm',
        name: 'confirm',
        message: 'Confirmez-vous vos choix ?',
        isVisible: false,
    }
];

async function askForDBDriver() {
    const choices = [
        {
            name: 'postgres',
            value: 'postgres',
            description: 'PostgreSQL is an object-relational database management system',
        },
        // ajoutez d'autres pilotes ici
    ];

    const answer = await select({
        message: 'Select a database driver',
        choices: choices,
    });

    return answer;
}

async function showUserChoices(connectionDetails: any) {
    console.log("\nVos choix :");
    for (const [key, value] of Object.entries(connectionDetails)) {
        console.log(`${key}: ${value}`);
    }
    console.log(""); 
}

async function createDatabase(driver: string, connectionDetails: any) {
    switch (driver) {
        case 'postgres':
           break;

        case 'mysql':
            // Ajoutez ici la logique pour MySQL (avec le module mysql ou mysql2 par exemple)
            break;

        // ... autres pilotes

        default:
            console.log('Driver non supporté');
            break;
    }
}

command
    .command('gen:db')
    .description('Create a new database')
    .action(async () => {
        // Filtrer les questions basées sur la propriété isVisible
        const visibleQuestions = basicQuestions.filter(question => question.isVisible !== false);

        const answers = await inquirer.prompt(visibleQuestions);
        console.log("\nVous avez répondu :");
        for (const [key, value] of Object.entries(answers)) {
            console.log(`${key}: ${value}`);
        }
    });

command.parse(process.argv);
