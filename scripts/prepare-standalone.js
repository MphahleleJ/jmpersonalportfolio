
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const standalone = path.join(root, ".next", "standalone");

if (!fs.existsSync(path.join(standalone, "server.js"))) {
  throw new Error("Next.js standalone server.js was not generated");
}

// Copy Next.js static assets.
const staticSource = path.join(root, ".next", "static");
const staticDestination = path.join(standalone, ".next", "static");

if (fs.existsSync(staticSource)) {
  fs.mkdirSync(staticDestination, { recursive: true });
  fs.cpSync(staticSource, staticDestination, {
    recursive: true,
  });
}

// Copy public assets if the directory exists.
const publicSource = path.join(root, "public");
const publicDestination = path.join(standalone, "public");

if (fs.existsSync(publicSource)) {
  fs.cpSync(publicSource, publicDestination, {
    recursive: true,
  });
}

console.log("Standalone deployment package prepared successfully.");