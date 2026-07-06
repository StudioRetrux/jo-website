#!/usr/bin/env node

import { spawn } from "node:child_process";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const FRAME_STRIDE = 5;

const rl = createInterface({ input, output });

function cleanAnswer(value) {
  return value.trim().replace(/^["']|["']$/g, "");
}

async function askRequired(question) {
  while (true) {
    const answer = cleanAnswer(await rl.question(question));
    if (answer) return answer;
    console.log("Required.");
  }
}

function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    const child = spawn("ffmpeg", args, { stdio: "inherit" });

    child.on("error", (error) => {
      if (error.code === "ENOENT") {
        reject(new Error("ffmpeg not found. Install ffmpeg and make sure it is in PATH."));
        return;
      }

      reject(error);
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`ffmpeg exited with code ${code}.`));
    });
  });
}

async function main() {
  const videoFileName = await askRequired("Video file name in project root: ");
  const videoPath = path.resolve(process.cwd(), videoFileName);
  const outputDir = path.resolve(
    process.cwd(),
    "exported",
    path.parse(videoFileName).name,
  );

  await mkdir(outputDir, { recursive: true });

  const framePattern = path.join(outputDir, "frame_%06d.png");
  const vf = `select='not(mod(n\\,${FRAME_STRIDE}))'`;

  console.log(`Exporting frames from ${videoPath}`);
  console.log(`Output: ${framePattern}`);
  console.log(`Stride: every ${FRAME_STRIDE} source frames`);

  await runFfmpeg([
    "-hide_banner",
    "-i",
    videoPath,
    "-vf",
    vf,
    "-vsync",
    "vfr",
    framePattern,
  ]);

  console.log("Done.");
}

main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => {
    rl.close();
  });
