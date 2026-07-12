import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'apps', 'ball-moving', 'dist');
const destination = path.join(root, 'dist', 'ball-moving');

if (!fs.existsSync(source)) {
  throw new Error('小球移动重置版尚未构建：缺少 apps/ball-moving/dist');
}

fs.rmSync(destination, { recursive: true, force: true });
fs.cpSync(source, destination, { recursive: true });
console.log('✓ ball-moving/');
