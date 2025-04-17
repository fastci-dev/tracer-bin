import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as io from '@actions/io';
import * as tc from '@actions/tool-cache';
import * as path from 'path';
import * as fs from 'fs';

async function run(): Promise<void> {
    try {
        // Get inputs
        // const jfrogUserWriter = core.getInput('jfrog_user_writer', { required: true });
        // const jfrogPasswordWriter = core.getInput('jfrog_password_writer', { required: true });
        const otelEndpoint = core.getInput('fastci_otel_endpoint', { required: true });
        const otelToken = core.getInput('fastci_otel_token', { required: true });

        // Download tracer binary
        const tracerUrl = 'https://github.com/fastci-dev/tracer-bin/releases/download/main/tracer.bin.5';
        core.info('Downloading tracer binary...');
        const tracerPath = await tc.downloadTool(tracerUrl);

        // Move to tracer-bin and make executable
        const tracerBinPath = path.join(process.cwd(), 'tracer-bin');
        await io.cp(tracerPath, tracerBinPath);
        await fs.promises.chmod(tracerBinPath, '755');

        // Start tracer
        core.info('Starting tracer...');
        const env = {
            ...process.env,
            OTEL_ENDPOINT: otelEndpoint,
            OTEL_TOKEN: otelToken
        };

        // Execute with sudo
        await exec.exec('sudo', [
            '-E',
            './tracer-bin &'
        ], { env });

        core.info('Tracer started successfully');
    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        } else {
            core.setFailed('An unknown error occurred');
        }
    }
}

run(); 