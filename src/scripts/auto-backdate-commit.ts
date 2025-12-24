#!/usr/bin/env bun
import fs from "fs";
import simpleGit from "simple-git";

// ----- CONFIG -----
const LOG_FILE = "commit_log.txt";
const GIT_USER_NAME = "DevWedeloper";
const GIT_USER_EMAIL = "vicnathangabrielle@gmail.com";

// ----- UTILS -----
const formatDate = (date: Date) => {
  // Format like: Sat, 06 Dec 2025 12:00:00 GMT+08:00
  const pad = (n: number) => n.toString().padStart(2, "0");
  
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const gmtOffset = 8; // GMT+8
  const local = new Date(date.getTime() + gmtOffset * 60 * 60 * 1000);
  
  const dayName = days[local.getUTCDay()];
  const day = pad(local.getUTCDate());
  const month = months[local.getUTCMonth()];
  const year = local.getUTCFullYear();
  const hour = pad(local.getUTCHours());
  const minute = pad(local.getUTCMinutes());
  const second = pad(local.getUTCSeconds());
  
  return `${dayName}, ${day} ${month} ${year} ${hour}:${minute}:${second} GMT+08:00`;
}

// Find insertion index in log file to maintain chronological order
const findInsertIndex = (lines: string[], targetDate: Date) => {
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/\d{2} \w{3} \d{4}/);
    if (!match) continue;
    const lineDate = new Date(match[0]);
    if (lineDate > targetDate) return i;
  }
  return lines.length;
};

// Check if a date already exists in the log
const dateExists = (lines: string[], targetDate: Date) => {
  const targetDay = targetDate.toDateString();
  return lines.some((line) => {
    const match = line.match(/\d{2} \w{3} \d{4}/);
    if (!match) return false;
    const lineDate = new Date(match[0]);
    return lineDate.toDateString() === targetDay;
  });
};

// ----- MAIN -----
const main = async () => {
  const args = process.argv.slice(2);
  if (!args) {
    console.error(
      "Usage: bun backdateCommit.ts YYYY-MM-DD[,YYYY-MM-DD,...]"
    );
    process.exit(1);
  }

  const isDev = args.includes("--development");

  const dates = args.map(d => new Date(d.trim())).filter(d => !isNaN(d.getTime()));
  const git = simpleGit();

  // Set git user config for this repo
  await git.addConfig("user.name", GIT_USER_NAME);
  await git.addConfig("user.email", GIT_USER_EMAIL);

  // Read existing log file
  const lines = fs.existsSync(LOG_FILE)
    ? fs.readFileSync(LOG_FILE, "utf-8")
        .split("\n")
        .filter(line => line.trim() !== "") // remove empty lines
    : [];

  for (const targetDate of dates) {
    const timestamp = formatDate(targetDate);

    // Skip if already exists
    if (dateExists(lines, targetDate)) {
      console.log(`Skipped ${timestamp} — already exists in log.`);
      continue;
    }

    // Find proper insertion index
    const insertIndex = findInsertIndex(lines, targetDate);

    // Insert line
    lines.splice(insertIndex, 0, `Backdated commit on ${timestamp}`);

    // Write file
    fs.writeFileSync(LOG_FILE, lines.join("\n"));

    // Stage and commit individually
    await git.add(LOG_FILE);
    await git.commit(`Backdated commit on ${timestamp}`, undefined, {
      "--date": targetDate.toISOString(),
    });

    console.log(`Committed backdated entry for ${timestamp}`);
  }

  if (!isDev) {
    await git.push();
    console.log("All backdated commits processed and pushed successfully.");
  } else {
    console.log("Development mode: skipping push. All commits created locally for review.");
  }
};

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
