import * as core from '@actions/core';
import { exec } from '@actions/exec';
import * as fs from 'fs';

async function cleanup(): Promise<void> {
  try {
    core.info('Stopping tracer process...');
    
    // Try to find tracer processes
    try {
      // Find and kill running tracer process
      await exec('pkill', ['-f', 'tracer-bin']);
      core.info('Tracer process stopped successfully');
    } catch (error) {
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