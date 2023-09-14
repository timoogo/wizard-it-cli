import { Command } from "commander";
import { Question } from "inquirer";

class ExtendedCommand extends Command {
    questionType!: string; // Renommez 'type' pour éviter la collision
    questionName!: string; // Renommez 'name' pour éviter la collision
    message!: string;
    default?: string;
    isVisible?: boolean;
}

export default ExtendedCommand;