import { Spinner } from 'clui';
import fs from 'fs';
import _ from 'lodash';
import simpleGit from 'simple-git';
import touch from 'touch';
import * as gh from './github';
import * as inquirer from './inquirer';

const git = simpleGit();

export const createRemoteRepo = async () => {
    const github = gh.getInstance();
    const answers = await inquirer.askRepoDetails();

    const data = {
        name: answers.name,
        description: answers.description,
        private: answers.visibility === 'private',
    };

    const status = new Spinner('Creating remote repository');
    status.start();
    try {
        const response = await github.repos.createForAuthenticatedUser(data);
        return response.data.ssh_url;
    } finally {
        status.stop();
    }
};

export const createGitIgnore = async () => {
    const files = _.without(fs.readdirSync('.'), '.git', '.gitignore');
    if (files.length) {
        const answers = await inquirer.askIgnoreFiles(files);

        if (answers.ignore.length) {
            fs.writeFileSync('.gitignore', answers.ignore.join('\n'));
        } else {
            touch('.gitignore');
        }
    } else {
        touch('.gitignore');
    }
};

export const setupRepo = async (url: string) => {
    const status = new Spinner('Initializing local repository and pushing to remote...');
    status.start();

    try {
        await git.init();
        await git.add('.gitignore');
        await git.add('./*');
        await git.commit('Initial commit');
        await git.addRemote('origin', url);
        await git.push('origin', 'master');
    } finally {
        status.stop();
    }
};
