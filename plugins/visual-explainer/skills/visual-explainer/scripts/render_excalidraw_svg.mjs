#!/usr/bin/env node
import process from "node:process";
import path from "node:path";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const usage = `Usage:
  node render_excalidraw_svg.mjs --input scene.excalidraw --output diagram.svg [--browser chrome]

Options:
  --input <path>     Excalidraw scene JSON or .excalidraw file.
  --output <path>    SVG file to write.
  --browser <name>   Playwright Chromium channel. Defaults to local Chrome, then bundled Chromium.
  --help             Show this help.
`;

function parseArgs(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") {
      options.help = true;
      continue;
    }
    if (arg === "--input" || arg === "-i") {
      options.input = argv[++index];
      continue;
    }
    if (arg === "--output" || arg === "-o") {
      options.output = argv[++index];
      continue;
    }
    if (arg === "--browser") {
      options.browser = argv[++index];
      continue;
    }
    throw new Error(`Unknown argument: ${arg}\n\n${usage}`);
  }
  return options;
}

function normalizeScene(rawScene) {
  const scene = Array.isArray(rawScene) ? { elements: rawScene } : rawScene;
  if (!scene || !Array.isArray(scene.elements)) {
    throw new Error("Input must be a .excalidraw scene object or an array of Excalidraw elements.");
  }

  return {
    type: scene.type || "excalidraw",
    version: scene.version || 2,
    source: scene.source || "https://excalidraw.com",
    elements: scene.elements,
    appState: {
      viewBackgroundColor: "#ffffff",
      ...(scene.appState || {}),
      exportBackground: true,
      exportEmbedScene: true,
      exportWithDarkMode: false,
    },
    files: scene.files || {},
  };
}

async function importDependency(packageName) {
  try {
    return await import(packageName);
  } catch (error) {
    error.message = `Missing renderer dependency "${packageName}". Run "npm install" in ${scriptDir}.\n${error.message}`;
    throw error;
  }
}

async function buildBrowserBundle(esbuild) {
  const entry = `
    import { exportToSvg } from "@excalidraw/utils";

    window.__visualExplainerRender = async (scene) => {
      const svg = await exportToSvg(scene);
      return new XMLSerializer().serializeToString(svg);
    };
  `;

  const result = await esbuild.build({
    stdin: {
      contents: entry,
      loader: "js",
      resolveDir: scriptDir,
    },
    bundle: true,
    format: "iife",
    globalName: "VisualExplainerRenderer",
    write: false,
    logLevel: "silent",
    loader: {
      ".ttf": "dataurl",
      ".otf": "dataurl",
      ".woff": "dataurl",
      ".woff2": "dataurl",
      ".png": "dataurl",
      ".svg": "dataurl",
    },
  });

  return result.outputFiles[0].text;
}

function isTransientLaunchError(error) {
  return /Target page, context or browser has been closed/i.test(error?.message || "");
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function launchBrowser(chromium, preferredChannel, options = {}) {
  const attemptsPerChannel = options.attemptsPerChannel ?? 4;
  const retryDelayMs = options.retryDelayMs ?? 250;
  const channels = [];
  if (preferredChannel && preferredChannel !== "bundled") {
    channels.push(preferredChannel);
  }
  if (!preferredChannel) {
    channels.push(process.env.VISUAL_EXPLAINER_BROWSER || "chrome");
  }
  channels.push(null);

  const failures = [];
  for (const channel of channels) {
    const launchOptions = { headless: true };
    if (channel) {
      launchOptions.channel = channel;
    }
    for (let attempt = 1; attempt <= attemptsPerChannel; attempt += 1) {
      try {
        return await chromium.launch(launchOptions);
      } catch (error) {
        const label = attemptsPerChannel > 1 ? ` attempt ${attempt}` : "";
        failures.push(`${channel || "bundled Chromium"}${label}: ${error.message.split("\n")[0]}`);
        if (attempt < attemptsPerChannel && isTransientLaunchError(error)) {
          await delay(retryDelayMs);
          continue;
        }
        break;
      }
    }
  }

  throw new Error(
    `Could not launch a Chromium browser.\nTried:\n- ${failures.join("\n- ")}\nInstall Google Chrome, pass --browser <channel>, or run "npm run --prefix scripts install-browser" from the skill root (equivalently "npx playwright install chromium" in ${scriptDir}).`,
  );
}

async function renderSvg(scene, browserChannel) {
  const [{ default: esbuild }, { chromium }] = await Promise.all([
    importDependency("esbuild"),
    importDependency("playwright"),
  ]);

  const bundle = await buildBrowserBundle(esbuild);
  const browser = await launchBrowser(chromium, browserChannel);
  try {
    const page = await browser.newPage();
    await page.setContent("<!doctype html><html><head><meta charset=\"utf-8\"></head><body></body></html>");
    await page.addScriptTag({ content: bundle });
    return await page.evaluate(async (sceneForBrowser) => {
      return window.__visualExplainerRender(sceneForBrowser);
    }, scene);
  } finally {
    await browser.close();
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(usage);
    return;
  }
  if (!options.input || !options.output) {
    throw new Error(`Both --input and --output are required.\n\n${usage}`);
  }

  const raw = JSON.parse(await readFile(options.input, "utf8"));
  const scene = normalizeScene(raw);
  const svg = await renderSvg(scene, options.browser);

  await mkdir(path.dirname(path.resolve(options.output)), { recursive: true });
  await writeFile(options.output, svg);
  process.stdout.write(`Wrote ${options.output}\n`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    process.stderr.write(`${error.stack || error.message}\n`);
    process.exitCode = 1;
  });
}

export { launchBrowser, normalizeScene, renderSvg };
