import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
import * as files from './lib/files';
import * as github from './lib/github';
import * as repo from './lib/repo';

clear();
console.log(chalk.yellow(figlet.textSync('Ginit', { horizontalLayout: 'full' })));

if (files.directoryExists('.git')) {
    console.log(chalk.red('Already Git repository'));
    process.exit();
}

const getGithubToken = async () => {
    let token = github.getStoredGithubToken();
    if (!token) {
        token = await github.__deprecated__getPersonalAccessToken();
    }
    return token;
};

const run = async () => {
    try {
        const token = await getGithubToken();
        github.githubAuth(token);

        const url = await repo.createRemoteRepo();
        await repo.createGitIgnore();
        await repo.setupRepo(url);

        console.log(chalk.green('All done!'));
    } catch (err) {
        if (err) {
            switch (err.status) {
                case 401:
                    console.log(chalk.red("Couldn't log you in. Please provide correct credentials/token."));
                    break;
                case 422:
                    console.log(chalk.red('There is already a remote repository or token with the same name'));
                    break;
                default:
                    console.log(chalk.red(err));
            }
        }
    }
};

run();
