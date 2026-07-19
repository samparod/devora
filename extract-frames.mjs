import { execFileSync } from 'child_process';
import { existsSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';

const __dirname = dirname(fileURLToPath(import.meta.url));
const videosDir = join(__dirname, 'assets', 'videos');
const framesDir = join(__dirname, 'assets', 'frames');
mkdirSync(framesDir, { recursive: true });

for (const file of readdirSync(videosDir).filter((f) => f.endsWith('.mp4'))) {
  const out = join(framesDir, file.replace('.mp4', '.jpg'));
  execFileSync(ffmpegPath.path, ['-y', '-ss', '1', '-i', join(videosDir, file), '-vframes', '1', '-q:v', '2', out], { stdio: 'pipe' });
  console.log('ok', file);
}
