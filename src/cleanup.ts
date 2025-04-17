import * as core from '@actions/core';
import { exec } from '@actions/exec';
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
            await exec('bash', ['-c', 'sudo pkill -SIGTERM -f tracer-bin']);
            // execNative('sudo pkill -SIGTERM -f tracer-bin', (err, stdout, stderr) => {
            //     if (err) {
            //         core.error(err);
            //     }
            //     if (stdout) {
            //         core.info(stdout);
            //     }
            //     if (stderr) {
            //         core.error(stderr);
            //     }
            // });
            core.info('Tracer process stopped successfully');
        } catch (error) {
            core.info(error instanceof Error ? error.message : String(error));
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