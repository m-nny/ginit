import inquirer from 'inquirer';
import * as files from './files';

export const askGithubCredentials = () => {
    return inquirer.prompt([
        {
            name: 'username',
            type: 'input',
            message: 'Enter your Github username or email address:',
            validate: (value) => (value.length ? true : 'Please enter you username or email address.'),
        },
        {
            name: 'password',
            type: 'password',
            message: 'Enter your password:',
            validate: (value) => (value.length ? true : 'Please enter your password.'),
        },
    ]);
};
export const askGithubAccessToken = () => {
    return inquirer.prompt({
        name: 'token',
        type: 'input',
        message: 'Enter your Github Access Token:',
        validate: (value) => (value.length ? true : 'Please enter you GAT.'),
    });
};
export const askGithub2FAuthorization = () => {
    return inquirer.prompt({
        name: 'twoFactorAuthorizationCode',
        type: 'input',
        message: 'Enter your two-factor authorization code',
        validate: (value) => (value.length ? true : 'Please enter you two-factor authorization code'),
    });
};
export const askRepoDetails = () => {
    const argv = require('minimist')(process.argv.slice(2));
    return inquirer.prompt([
        {
            name: 'name',
            type: 'input',
            message: 'Enter a name for the repository:',
            default: argv._[0] || files.getCurrentDirectoryBase(),
            validate: (value) => (value.length ? true : 'Please enter a name for the repository'),
        },
        {
            name: 'description',
            type: 'input',
            message: 'Optionally enter description for the repository:',
            default: argv._[1] || null,
        },
        {
            name: 'visibility',
            type: 'list',
            message: 'Public or private',
            choices: ['public', 'private'],
            default: 'public',
        },
    ]);
};
export const askIgnoreFiles = (files: string[]) => {
    return inquirer.prompt({
        name: 'ignore',
        type: 'checkbox',
        message: 'Select the files and/or folders you wish to ignore: ',
        choices: files,
        default: ['node_modules', 'bower_components'],
    });
};
