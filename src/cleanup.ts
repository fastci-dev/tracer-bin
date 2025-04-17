import * as core from '@actions/core';
import { exec } from '@actions/exec';
import * as fs from 'fs';
import process from 'process';

async function cleanup(): Promise<void> {
    try {
        core.info('Stopping tracer process...');

        // Try to find tracer processes
        try {
            core.info('Setting /tmp/fastci/trigger file to stop tracer');

            // makir /tmp/fastci/
            fs.mkdirSync('/tmp/fastci', { recursive: true });

            // write the trigger file
            fs.writeFileSync('/tmp/fastci/trigger', 'stop');

            // wait until the proces of tracer-bin is no longer alive
            const startTime = Date.now();
            while (fs.existsSync('/tmp/fastci/trigger')) {
                const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
                process.stdout.write(`\rWaiting for tracer process to stop... (${elapsed}s)`);
                await new Promise(resolve => setTimeout(resolve, 200));
            }
            process.stdout.write('\n'); // Add newline after the waiting is done
            await exec('cat /tmp/fastci/process_trees.json');

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