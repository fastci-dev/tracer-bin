import * as core from '@actions/core';
import { getExecOutput } from '@actions/exec';
// import { exec as execNative } from 'child_process';
import * as fs from 'fs';
// import { stdout } from 'process';
// const { promisify } = require('util');

// const execPromise = promisify(execNative);

async function cleanup(): Promise<void> {
    try {
        core.info('Stopping tracer process...');

        // Try to find tracer processes
        try {
            // Find and kill running tracer process
            // await exec('ps', ['-aux']);
            const { stdout, stderr, exitCode } = await getExecOutput('pkill', ['-SIGINT', '-f', 'tracer-bin']);
            core.info(`stdout: ${stdout}`);
            core.info(`stderr: ${stderr}`);
            core.info(`exitCode: ${exitCode}`);
            core.info('Tracer process stopped successfully');
        } catch (error) {
            core.info(error as any);
            core.info('No tracer process found or unable to stop it');
        }

        // check if /tmp/fastci/process_trees.json exists
        if (fs.existsSync('/tmp/fastci/process_trees.json')) {
            //   exec('./tracer-bin', ['--collect-only']);
            core.info('process_trees.json file found successfully');
        } else {
            core.info('process_trees.json file does not exist');
        }

        core.info('Cleanup completed');
    } catch (error) {
        if (error instanceof Error) {
            core.warning(`Cleanup failed: ${error.message}`);
        } else {
            core.warning('Cleanup failed with an unknown error');
        }
        // Don't fail the action if cleanup fails
    }
}

cleanup(); 