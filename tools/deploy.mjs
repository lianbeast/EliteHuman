import { execSync } from 'node:child_process';
import { cp, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';

execSync('npm run build', { stdio: 'inherit' });
const src = 'public/assets';
const dest = 'dist/assets';
if (!existsSync(dest)) await mkdir(dest, { recursive: true });
await cp(src, dest, { recursive: true });
console.log('✓ Build + assets ready in ./dist');
