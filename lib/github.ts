import { createBasicAuth } from '@octokit/auth-basic';
import { TokenAuthentication } from '@octokit/auth-basic/dist-types/types';
import { Octokit } from '@octokit/rest';
import { Spinner } from 'clui';
import ConfigStore from 'configstore';
import pkg from '../package.json';
import * as inquirer from './inquirer';

const conf = new ConfigStore(pkg.name);

let octokit: Octokit;

export const getInstance = () => octokit;
export const getStoredGithubToken = () => conf.get('github.token');
export const getPersonalAccessToken = () => {
    return inquirer.askGithubAccessToken();
};
export const __deprecated__getPersonalAccessToken = async () => {
    const credentials = await inquirer.askGithubCredentials();
    const status = new Spinner('Authenticating you, please wait...');

    status.start();

    const auth = createBasicAuth({
        username: credentials.username,
        password: credentials.password,
        async on2Fa() {
            status.stop();
            const res = await inquirer.askGithub2FAuthorization();
            status.start();
            return res.twoFactorAuthorizationCode;
        },
        token: {
            scopes: ['user', 'public_repo', 'repo', 'repo:status'],
            note: 'ginit. the command-line tool for initializing Git repos',
        },
    });
    try {
        const res = (await auth()) as TokenAuthentication;
        if (res.token) {
            conf.set('github.token', res.token);
            return res.token;
        } else {
            throw new Error('Github token was not found in the response');
        }
    } finally {
        status.stop();
    }
};
export const githubAuth = (token: string) => (octokit = new Octokit({ auth: token }));
