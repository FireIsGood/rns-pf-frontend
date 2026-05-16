import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { exec } from 'child_process';

function pexec(command: string) {
	return new Promise<{ stdout: string; stderr: string }>(function (resolve, reject) {
		exec(command, (err, stdout, stderr) => {
			if (err) {
				reject(err);
			}
			resolve({ stdout, stderr });
		});
	});
}

const [gitHash, buildDate] = (
	await Promise.all([
		pexec('git rev-parse --short HEAD'),
		pexec('git log -1 --format=%cd --date=format:"%Y-%m-%d %H:%M"')
	])
).map((res) => JSON.stringify(res.stdout.trim()));

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		port: 2757
	},
	define: {
		// Must be JSON stringify as it is direct replacement
		__GIT_HASH__: gitHash,
		__BUILD_DATE__: buildDate
	},
	ssr: {
		noExternal: ['hi']
	}
});
