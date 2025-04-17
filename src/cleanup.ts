import * as core from '@actions/core';
import * as fs from 'fs';

async function cleanup(): Promise<void> {
    try {
        core.info('Stopping tracer process...');

        // Try to find tracer processes
        try {
            // set env var of TRIGGER_TRACER_STOP to true
            core.info('Setting /tmp/fastci/trigger file to stop tracer');

            fs.writeFileSync('/tmp/fastci/trigger', 'stop');

            // wait until the proces of tracer-bin is no longer alive
            while (fs.existsSync('/tmp/fastci/trigger')) {
                core.info('Waiting for tracer process to stop...');
                await new Promise(resolve => setTimeout(resolve, 200));
            }

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