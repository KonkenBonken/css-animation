import fs from 'fs/promises';
import bmp from 'bmp-js';

const width = 64;
const height = 32;
const pxlsPerFrame = width * height;
const frameCount = 34;
const totHeight = height * frameCount; // 1088
const pixelSize = 20;

console.time('time');

const buffer = await fs.readFile('keyframes.bmp');
const { data } = bmp.decode(buffer);
const pixels = new Uint8Array(data);
const frames = [];

const pxlClr = pxlVal => (pxlVal * 16).toString(16).padStart(3, '0');

for (var i = 0; i < frameCount;)
	frames.push(
		pixels.subarray(pxlsPerFrame * i, pxlsPerFrame * ++i)
	);

let css = '@keyframes animation{';
let txt = '';

for (const i in frames) {
	const frame = frames[i];
	css += `${Math.round(i/frameCount*100)}%{box-shadow:`;

	console.log(frame, frame.length, width * height);

	for (const j in frame) {
		const value = frame[j];

		const x = j % width;
		const y = Math.floor(j / width);
		const clr = pxlClr(value);

		css += `${x * pixelSize}px ${y * pixelSize}px #${clr},`
		if (!x) txt += '\n';
		txt += value ? '■' : ' ';
	}

	css = css.slice(0, -1);
	css += ';}';
}

css += '}';

fs.writeFile('shadow.css', css)

console.timeEnd('time');