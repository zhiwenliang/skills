import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { launchBrowser, normalizeScene } from "./render_excalidraw_svg.mjs";
import { validateVisualExplainerScene } from "./validate_visual_explainer_scene.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.dirname(scriptDir);
const rendererPath = path.join(scriptDir, "render_excalidraw_svg.mjs");
const REAL_RENDER_TIMEOUT_MS = 120_000;

function baseElement(overrides) {
  return {
    angle: 0,
    strokeColor: "#1e1e1e",
    backgroundColor: "transparent",
    fillStyle: "solid",
    strokeWidth: 2,
    strokeStyle: "solid",
    roughness: 1,
    opacity: 100,
    groupIds: [],
    frameId: null,
    seed: 101,
    versionNonce: 101,
    version: 1,
    isDeleted: false,
    boundElements: null,
    updated: 1,
    link: null,
    locked: false,
    ...overrides,
  };
}

function comparableSvg(svg) {
  return svg.replace(/<metadata>[\s\S]*?<\/metadata>/, "<metadata/>");
}

function makeTeachingScene({ metadata } = {}) {
  return {
    type: "excalidraw",
    version: 2,
    source: "https://excalidraw.com",
    ...(metadata ? { visualExplainer: metadata } : {}),
    elements: [
      baseElement({ id: "title", type: "text", x: 20, y: 16, width: 620, height: 36, text: "Gradient descent: find a lower error", originalText: "Gradient descent: find a lower error", fontSize: 32, fontFamily: 5 }),
      baseElement({ id: "subtitle", type: "text", x: 20, y: 58, width: 840, height: 28, text: "The model changes weights in the direction that most reduces the loss.", originalText: "The model changes weights in the direction that most reduces the loss.", fontSize: 20, fontFamily: 5 }),
      baseElement({ id: "loss-curve", type: "line", x: 70, y: 300, width: 430, height: -190, points: [[0, 0], [80, -120], [170, -170], [280, -140], [430, -190]], strokeColor: "#364fc7", seed: 301, versionNonce: 301 }),
      baseElement({ id: "point-a", type: "ellipse", x: 136, y: 196, width: 34, height: 34, backgroundColor: "#ffc9c9" }),
      baseElement({ id: "point-b", type: "ellipse", x: 266, y: 146, width: 34, height: 34, backgroundColor: "#ffd8a8" }),
      baseElement({ id: "point-c", type: "ellipse", x: 454, y: 104, width: 34, height: 34, backgroundColor: "#b2f2bb" }),
      baseElement({ id: "loss-label", type: "text", x: 80, y: 336, width: 300, height: 28, text: "Loss surface: height means error", originalText: "Loss surface: height means error", fontSize: 20, fontFamily: 5 }),
      baseElement({ id: "rule-box", type: "rectangle", x: 560, y: 120, width: 280, height: 120, backgroundColor: "#d0ebff", roundness: { type: 3, value: 26 } }),
      baseElement({ id: "rule-text", type: "text", x: 586, y: 144, width: 228, height: 68, text: "Rule\nmeasure slope\nstep downhill", originalText: "Rule\nmeasure slope\nstep downhill", fontSize: 22, fontFamily: 5 }),
      baseElement({ id: "example-box", type: "rectangle", x: 560, y: 300, width: 310, height: 118, backgroundColor: "#fff3bf", roundness: { type: 3, value: 26 } }),
      baseElement({ id: "example-text", type: "text", x: 586, y: 324, width: 260, height: 58, text: "Example\nprediction high ->\nweights move lower", originalText: "Example\nprediction high ->\nweights move lower", fontSize: 20, fontFamily: 5 }),
      baseElement({ id: "takeaway", type: "text", x: 20, y: 454, width: 820, height: 30, text: "Takeaway: training is repeated small moves toward less error.", originalText: "Takeaway: training is repeated small moves toward less error.", fontSize: 20, fontFamily: 5 }),
      baseElement({ id: "arrow-1-label", type: "text", x: 184, y: 176, width: 100, height: 22, text: "step down", originalText: "step down", fontSize: 16, fontFamily: 5 }),
      baseElement({ id: "arrow-2-label", type: "text", x: 356, y: 126, width: 120, height: 22, text: "step again", originalText: "step again", fontSize: 16, fontFamily: 5 }),
      baseElement({ id: "arrow-3-label", type: "text", x: 518, y: 130, width: 90, height: 22, text: "use rule", originalText: "use rule", fontSize: 16, fontFamily: 5 }),
      baseElement({ id: "arrow-1", type: "arrow", x: 170, y: 214, width: 92, height: -38, points: [[0, 0], [92, -38]], startBinding: null, endBinding: null, lastCommittedPoint: null, startArrowhead: null, endArrowhead: "arrow" }),
      baseElement({ id: "arrow-2", type: "arrow", x: 304, y: 160, width: 146, height: -34, points: [[0, 0], [146, -34]], startBinding: null, endBinding: null, lastCommittedPoint: null, startArrowhead: null, endArrowhead: "arrow" }),
      baseElement({ id: "arrow-3", type: "arrow", x: 498, y: 160, width: 52, height: 16, points: [[0, 0], [52, 16]], startBinding: null, endBinding: null, lastCommittedPoint: null, startArrowhead: null, endArrowhead: "arrow" }),
    ],
    appState: { viewBackgroundColor: "#ffffff" },
    files: {},
  };
}

function makeOldValidGenericProcessScene() {
  const scene = makeTeachingScene();
  return {
    ...scene,
    elements: [
      baseElement({ id: "title", type: "text", x: 20, y: 16, width: 620, height: 36, text: "Transformer: meaning changes with context", originalText: "Transformer: meaning changes with context", fontSize: 32, fontFamily: 5 }),
      baseElement({ id: "subtitle", type: "text", x: 20, y: 58, width: 860, height: 28, text: "Each step rewrites a token by mixing information from useful neighboring tokens.", originalText: "Each step rewrites a token by mixing information from useful neighboring tokens.", fontSize: 20, fontFamily: 5 }),
      baseElement({ id: "box-a", type: "rectangle", x: 20, y: 130, width: 190, height: 120, backgroundColor: "#d0ebff", roundness: { type: 3, value: 26 } }),
      baseElement({ id: "box-b", type: "rectangle", x: 260, y: 130, width: 220, height: 120, backgroundColor: "#fff3bf", roundness: { type: 3, value: 26 } }),
      baseElement({ id: "box-c", type: "rectangle", x: 530, y: 130, width: 210, height: 120, backgroundColor: "#d3f9d8", roundness: { type: 3, value: 26 } }),
      baseElement({ id: "box-d", type: "rectangle", x: 790, y: 130, width: 220, height: 120, backgroundColor: "#eebefa", roundness: { type: 3, value: 26 } }),
      baseElement({ id: "text-a", type: "text", x: 44, y: 154, width: 142, height: 70, text: "Tokens\nwords become\nvectors", originalText: "Tokens\nwords become\nvectors", fontSize: 20, fontFamily: 5 }),
      baseElement({ id: "text-b", type: "text", x: 286, y: 154, width: 168, height: 70, text: "Attention\neach token scores\nwhich others matter", originalText: "Attention\neach token scores\nwhich others matter", fontSize: 20, fontFamily: 5 }),
      baseElement({ id: "text-c", type: "text", x: 554, y: 154, width: 162, height: 70, text: "Layers\nrepeat attention\nplus feed-forward", originalText: "Layers\nrepeat attention\nplus feed-forward", fontSize: 20, fontFamily: 5 }),
      baseElement({ id: "text-d", type: "text", x: 816, y: 154, width: 168, height: 70, text: "Output\ncontext decides\nnew meaning", originalText: "Output\ncontext decides\nnew meaning", fontSize: 20, fontFamily: 5 }),
      baseElement({ id: "callout", type: "text", x: 260, y: 306, width: 560, height: 60, text: "Why it works: attention creates a weighted mix of useful context before the next representation is passed onward.", originalText: "Why it works: attention creates a weighted mix of useful context before the next representation is passed onward.", fontSize: 18, fontFamily: 5 }),
      baseElement({ id: "example", type: "text", x: 20, y: 390, width: 620, height: 32, text: "Example: 'bass' changes meaning in a music sentence or a fish sentence.", originalText: "Example: 'bass' changes meaning in a music sentence or a fish sentence.", fontSize: 18, fontFamily: 5 }),
      baseElement({ id: "takeaway", type: "text", x: 20, y: 448, width: 780, height: 32, text: "Takeaway: transformers replace fixed word meaning with context-aware meaning in every layer.", originalText: "Takeaway: transformers replace fixed word meaning with context-aware meaning in every layer.", fontSize: 20, fontFamily: 5 }),
      baseElement({ id: "arrow-1", type: "arrow", x: 220, y: 190, width: 35, height: 0, points: [[0, 0], [35, 0]], startBinding: null, endBinding: null, lastCommittedPoint: null, startArrowhead: null, endArrowhead: "arrow" }),
      baseElement({ id: "arrow-2", type: "arrow", x: 490, y: 190, width: 35, height: 0, points: [[0, 0], [35, 0]], startBinding: null, endBinding: null, lastCommittedPoint: null, startArrowhead: null, endArrowhead: "arrow" }),
      baseElement({ id: "arrow-3", type: "arrow", x: 750, y: 190, width: 35, height: 0, points: [[0, 0], [35, 0]], startBinding: null, endBinding: null, lastCommittedPoint: null, startArrowhead: null, endArrowhead: "arrow" }),
    ],
  };
}

function transformerDesignMetadata(arrowIds = ["arrow-1", "arrow-2", "arrow-3"], overrides = {}) {
  return {
    version: 1,
    topic: "transformer",
    diagramPattern: "layered-system",
    centralQuestion: "How does a transformer make a word depend on context?",
    oneSentenceAnswer: "It embeds tokens, mixes relevant context with attention, and repeats that update through layers.",
    whyThisPattern: "A layered-system diagram shows how representations are progressively rewritten instead of treating the model as one box.",
    readerTakeaways: [
      "Tokens start as vectors.",
      "Attention chooses useful context.",
      "Layered updates create context-aware meaning.",
    ],
    microExample: "The word bass shifts toward music or fish depending on nearby tokens.",
    visualAnchors: [
      { elementId: "tokens", labelElementId: "tokens-text", role: "input token representation" },
      { elementId: "attention", labelElementId: "attention-text", role: "context scoring and mixing" },
      { elementId: "layers", labelElementId: "layers-text", role: "repeated representation update" },
      { elementId: "output", labelElementId: "output-text", role: "contextual meaning result" },
    ],
    semanticArrows: arrowIds.map((elementId, index) => {
      const isCalloutPointer = elementId.startsWith("callout");
      return {
        elementId,
        kind: isCalloutPointer ? "callout-pointer" : "main",
        ...(isCalloutPointer ? {} : { labelElementId: `${elementId}-label` }),
        verb: index === 0 ? "scores context" : index === 1 ? "refines representation" : "produces meaning",
        from: index === 0 ? "tokens" : index === 1 ? "attention" : "layers",
        to: index === 0 ? "attention" : index === 1 ? "layers" : "contextual output",
      };
    }),
    visualEncodings: [
      { channel: "left-to-right position", meaning: "later position means later representation stage" },
      { channel: "pastel fill color", meaning: "different subsystem or teaching role" },
    ],
    ...overrides,
  };
}

test("forces SVG export settings needed for editable Excalidraw output", () => {
  const scene = normalizeScene({
    elements: [],
    appState: {
      exportBackground: false,
      exportEmbedScene: false,
      exportWithDarkMode: true,
      viewBackgroundColor: "#f8f9fa",
    },
  });

  assert.equal(scene.appState.exportBackground, true);
  assert.equal(scene.appState.exportEmbedScene, true);
  assert.equal(scene.appState.exportWithDarkMode, false);
  assert.equal(scene.appState.viewBackgroundColor, "#f8f9fa");
});

test("retries transient Chrome launch closures before falling back", async () => {
  let attempts = 0;
  const fakeChromium = {
    async launch(options) {
      attempts += 1;
      if (options.channel === "chrome" && attempts === 1) {
        throw new Error("browserType.launch: Target page, context or browser has been closed");
      }
      return { channel: options.channel || "bundled" };
    },
  };

  const browser = await launchBrowser(fakeChromium, undefined, { retryDelayMs: 0 });

  assert.equal(browser.channel, "chrome");
  assert.equal(attempts, 2);
});

test("tolerates repeated transient Chrome launch closures", async () => {
  let attempts = 0;
  const fakeChromium = {
    async launch(options) {
      attempts += 1;
      if (options.channel === "chrome" && attempts < 4) {
        throw new Error("browserType.launch: Target page, context or browser has been closed");
      }
      if (!options.channel) {
        throw new Error("bundled browser missing");
      }
      return { channel: options.channel };
    },
  };

  const browser = await launchBrowser(fakeChromium, undefined, { retryDelayMs: 0 });

  assert.equal(browser.channel, "chrome");
  assert.equal(attempts, 4);
});

test("renders a complete Excalidraw SVG from a scene JSON", { timeout: REAL_RENDER_TIMEOUT_MS }, async () => {
  const workspace = await mkdtemp(path.join(os.tmpdir(), "visual-explainer-test-"));
  try {
    const scenePath = path.join(workspace, "scene.excalidraw");
    const svgPath = path.join(workspace, "scene.svg");
    const scene = {
      type: "excalidraw",
      version: 2,
      source: "https://excalidraw.com",
      elements: [
        baseElement({
          id: "box",
          type: "rectangle",
          x: 60,
          y: 80,
          width: 260,
          height: 116,
          backgroundColor: "#d0ebff",
          fillStyle: "hachure",
          seed: 201,
          versionNonce: 201,
          roundness: { type: 3, value: 28 },
        }),
        baseElement({
          id: "label",
          type: "text",
          x: 100,
          y: 124,
          width: 180,
          height: 30,
          text: "Explain one thing",
          fontSize: 24,
          fontFamily: 5,
          textAlign: "center",
          verticalAlign: "middle",
          containerId: null,
          originalText: "Explain one thing",
          lineHeight: 1.25,
          baseline: 22,
          seed: 202,
          versionNonce: 202,
        }),
      ],
      appState: {
        viewBackgroundColor: "#ffffff",
        exportBackground: true,
        exportEmbedScene: true,
        exportWithDarkMode: false,
      },
      files: {},
    };

    await writeFile(scenePath, JSON.stringify(scene, null, 2));

    const result = spawnSync(process.execPath, [rendererPath, "--input", scenePath, "--output", svgPath], {
      cwd: scriptDir,
      encoding: "utf8",
    });

    assert.equal(result.status, 0, result.stderr || result.stdout);

    const svg = await readFile(svgPath, "utf8");
    assert.match(svg, /^<svg\b/);
    assert.match(svg, /svg-source:excalidraw/);
    assert.match(svg, /application\/vnd\.excalidraw\+json/);
    assert.match(svg, /font-family="Excalifont/);
    assert.match(svg, /<path\b/);
    assert.match(svg, /Explain one thing/);
  } finally {
    await rm(workspace, { recursive: true, force: true });
  }
});

test("committed latest style SVG matches the editable Excalidraw source", { timeout: REAL_RENDER_TIMEOUT_MS }, async () => {
  const workspace = await mkdtemp(path.join(os.tmpdir(), "visual-explainer-assets-"));
  try {
    const sourcePath = path.join(skillRoot, "assets", "latest-style-demo.excalidraw");
    const committedSvgPath = path.join(skillRoot, "assets", "latest-style-demo.svg");
    const generatedSvgPath = path.join(workspace, "latest-style-demo.svg");

    const result = spawnSync(process.execPath, [rendererPath, "--input", sourcePath, "--output", generatedSvgPath], {
      cwd: scriptDir,
      encoding: "utf8",
    });

    assert.equal(result.status, 0, result.stderr || result.stdout);
    const generatedSvg = await readFile(generatedSvgPath, "utf8");
    const committedSvg = await readFile(committedSvgPath, "utf8");

    assert.match(committedSvg, /application\/vnd\.excalidraw\+json/);
    assert.equal(comparableSvg(generatedSvg), comparableSvg(committedSvg));
  } finally {
    await rm(workspace, { recursive: true, force: true });
  }
});

test("visual explainer scenes must be detailed enough to teach the core idea", async () => {
  const sparseScene = {
    type: "excalidraw",
    version: 2,
    source: "https://excalidraw.com",
    elements: [
      baseElement({ id: "box-a", type: "rectangle", x: 20, y: 20, width: 180, height: 90 }),
      baseElement({ id: "text-a", type: "text", x: 40, y: 48, width: 140, height: 30, text: "Input", originalText: "Input", fontSize: 24, fontFamily: 5 }),
      baseElement({ id: "arrow", type: "arrow", x: 220, y: 65, width: 90, height: 0, points: [[0, 0], [90, 0]], startBinding: null, endBinding: null, lastCommittedPoint: null, startArrowhead: null, endArrowhead: "arrow" }),
      baseElement({ id: "box-b", type: "rectangle", x: 330, y: 20, width: 180, height: 90 }),
      baseElement({ id: "text-b", type: "text", x: 350, y: 48, width: 140, height: 30, text: "Output", originalText: "Output", fontSize: 24, fontFamily: 5 }),
    ],
    appState: { viewBackgroundColor: "#ffffff" },
    files: {},
  };

  const richScene = {
    ...sparseScene,
    visualExplainer: transformerDesignMetadata(),
    elements: [
      baseElement({ id: "title", type: "text", x: 20, y: 16, width: 620, height: 36, text: "Transformer: meaning changes with context", originalText: "Transformer: meaning changes with context", fontSize: 32, fontFamily: 5 }),
      baseElement({ id: "subtitle", type: "text", x: 20, y: 58, width: 840, height: 28, text: "A token mixes useful neighbors before passing onward.", originalText: "A token mixes useful neighbors before passing onward.", fontSize: 20, fontFamily: 5 }),
      baseElement({ id: "tokens", type: "rectangle", x: 20, y: 130, width: 190, height: 120 }),
      baseElement({ id: "tokens-text", type: "text", x: 38, y: 150, width: 154, height: 74, text: "Tokens\nwords become\nvectors", originalText: "Tokens\nwords become\nvectors", fontSize: 20, fontFamily: 5 }),
      baseElement({ id: "attention", type: "rectangle", x: 270, y: 110, width: 250, height: 160 }),
      baseElement({ id: "attention-text", type: "text", x: 292, y: 130, width: 206, height: 92, text: "Self-attention\neach token scores\nwhich others matter", originalText: "Self-attention\neach token scores\nwhich others matter", fontSize: 20, fontFamily: 5 }),
      baseElement({ id: "layers", type: "rectangle", x: 580, y: 130, width: 210, height: 120 }),
      baseElement({ id: "layers-text", type: "text", x: 604, y: 150, width: 162, height: 74, text: "Layers\nrepeat attention\nplus feed-forward", originalText: "Layers\nrepeat attention\nplus feed-forward", fontSize: 20, fontFamily: 5 }),
      baseElement({ id: "output", type: "rectangle", x: 270, y: 330, width: 250, height: 130 }),
      baseElement({ id: "output-text", type: "text", x: 292, y: 350, width: 206, height: 74, text: "Contextual output\n'bass' changes with\nmusic or fish", originalText: "Contextual output\n'bass' changes with\nmusic or fish", fontSize: 20, fontFamily: 5 }),
      baseElement({ id: "why", type: "text", x: 560, y: 340, width: 320, height: 92, text: "Why it works:\nattention weights useful context before the next update.", originalText: "Why it works:\nattention weights useful context before the next update.", fontSize: 18, fontFamily: 5 }),
      baseElement({ id: "takeaway", type: "text", x: 20, y: 510, width: 780, height: 32, text: "Takeaway: meaning is rewritten by context in every layer.", originalText: "Takeaway: meaning is rewritten by context in every layer.", fontSize: 20, fontFamily: 5 }),
      baseElement({ id: "arrow-1-label", type: "text", x: 226, y: 162, width: 56, height: 20, text: "scores", originalText: "scores", fontSize: 16, fontFamily: 5 }),
      baseElement({ id: "arrow-2-label", type: "text", x: 536, y: 162, width: 56, height: 20, text: "refines", originalText: "refines", fontSize: 16, fontFamily: 5 }),
      baseElement({ id: "arrow-3-label", type: "text", x: 548, y: 292, width: 72, height: 20, text: "outputs", originalText: "outputs", fontSize: 16, fontFamily: 5 }),
      baseElement({ id: "arrow-1", type: "arrow", x: 220, y: 190, width: 45, height: 0, points: [[0, 0], [45, 0]], startBinding: null, endBinding: null, lastCommittedPoint: null, startArrowhead: null, endArrowhead: "arrow" }),
      baseElement({ id: "arrow-2", type: "arrow", x: 530, y: 190, width: 45, height: 0, points: [[0, 0], [45, 0]], startBinding: null, endBinding: null, lastCommittedPoint: null, startArrowhead: null, endArrowhead: "arrow" }),
      baseElement({ id: "arrow-3", type: "arrow", x: 670, y: 270, width: -160, height: 70, points: [[0, 0], [-160, 70]], startBinding: null, endBinding: null, lastCommittedPoint: null, startArrowhead: null, endArrowhead: "arrow" }),
    ],
  };

  const sparse = validateVisualExplainerScene(sparseScene);
  assert.equal(sparse.ok, false);
  assert.match(sparse.errors.join("\n"), /visible-word equivalents|visualExplainer design metadata/);

  const rich = validateVisualExplainerScene(richScene);
  assert.equal(rich.ok, true, rich.errors.join("\n"));
});

test("visual explainer scenes reject text-heavy layouts and messy arrow paths", () => {
  const textHeavyScene = {
    type: "excalidraw",
    version: 2,
    source: "https://excalidraw.com",
    visualExplainer: transformerDesignMetadata(undefined, {
      visualAnchors: [
        { elementId: "block-a", labelElementId: "text-a", role: "input token representation" },
        { elementId: "block-b", labelElementId: "text-b", role: "attention score calculation" },
        { elementId: "block-c", labelElementId: "text-c", role: "layer stack update" },
        { elementId: "block-d", labelElementId: "text-d", role: "context-aware output" },
      ],
    }),
    elements: [
      baseElement({ id: "title", type: "text", x: 20, y: 16, width: 620, height: 36, text: "Transformer: meaning changes with context", originalText: "Transformer: meaning changes with context", fontSize: 32, fontFamily: 5 }),
      baseElement({ id: "block-a", type: "rectangle", x: 20, y: 90, width: 210, height: 120 }),
      baseElement({ id: "block-b", type: "rectangle", x: 270, y: 90, width: 240, height: 120 }),
      baseElement({ id: "block-c", type: "rectangle", x: 550, y: 90, width: 210, height: 120 }),
      baseElement({ id: "block-d", type: "rectangle", x: 800, y: 90, width: 210, height: 120 }),
      baseElement({ id: "label-a", type: "text", x: 48, y: 72, width: 140, height: 24, text: "Input tokens", originalText: "Input tokens", fontSize: 18, fontFamily: 5 }),
      baseElement({ id: "label-b", type: "text", x: 302, y: 72, width: 160, height: 24, text: "Attention scores", originalText: "Attention scores", fontSize: 18, fontFamily: 5 }),
      baseElement({ id: "label-c", type: "text", x: 594, y: 72, width: 130, height: 24, text: "Layer stack", originalText: "Layer stack", fontSize: 18, fontFamily: 5 }),
      baseElement({ id: "label-d", type: "text", x: 830, y: 72, width: 150, height: 24, text: "New meaning", originalText: "New meaning", fontSize: 18, fontFamily: 5 }),
      baseElement({ id: "text-a", type: "text", x: 38, y: 110, width: 174, height: 74, text: "Tokens are converted into vectors that carry rough meaning and position before any attention is calculated.", originalText: "Tokens are converted into vectors that carry rough meaning and position before any attention is calculated.", fontSize: 18, fontFamily: 5 }),
      baseElement({ id: "text-b", type: "text", x: 292, y: 110, width: 196, height: 92, text: "Self-attention compares each token with every other token, scores relevance, then builds a weighted mixture of useful context.", originalText: "Self-attention compares each token with every other token, scores relevance, then builds a weighted mixture of useful context.", fontSize: 18, fontFamily: 5 }),
      baseElement({ id: "text-c", type: "text", x: 572, y: 110, width: 166, height: 74, text: "Layers repeat this process with feed-forward updates, gradually refining each representation.", originalText: "Layers repeat this process with feed-forward updates, gradually refining each representation.", fontSize: 18, fontFamily: 5 }),
      baseElement({ id: "text-d", type: "text", x: 822, y: 110, width: 166, height: 74, text: "The output is context aware, so the same word can mean different things in different sentences.", originalText: "The output is context aware, so the same word can mean different things in different sentences.", fontSize: 18, fontFamily: 5 }),
      baseElement({ id: "takeaway", type: "text", x: 20, y: 260, width: 830, height: 56, text: "Takeaway: the model does not store one fixed meaning for a word; attention repeatedly rewrites meaning by looking at the surrounding words.", originalText: "Takeaway: the model does not store one fixed meaning for a word; attention repeatedly rewrites meaning by looking at the surrounding words.", fontSize: 18, fontFamily: 5 }),
      baseElement({ id: "arrow-1-label", type: "text", x: 228, y: 124, width: 56, height: 20, text: "scores", originalText: "scores", fontSize: 16, fontFamily: 5 }),
      baseElement({ id: "arrow-2-label", type: "text", x: 508, y: 124, width: 56, height: 20, text: "refines", originalText: "refines", fontSize: 16, fontFamily: 5 }),
      baseElement({ id: "arrow-3-label", type: "text", x: 758, y: 124, width: 60, height: 20, text: "outputs", originalText: "outputs", fontSize: 16, fontFamily: 5 }),
      baseElement({ id: "arrow-1", type: "arrow", x: 240, y: 150, width: 25, height: 0, points: [[0, 0], [25, 0]], startBinding: null, endBinding: null, lastCommittedPoint: null, startArrowhead: null, endArrowhead: "arrow" }),
      baseElement({ id: "arrow-2", type: "arrow", x: 520, y: 150, width: 25, height: 0, points: [[0, 0], [25, 0]], startBinding: null, endBinding: null, lastCommittedPoint: null, startArrowhead: null, endArrowhead: "arrow" }),
      baseElement({ id: "arrow-3", type: "arrow", x: 770, y: 150, width: 25, height: 0, points: [[0, 0], [25, 0]], startBinding: null, endBinding: null, lastCommittedPoint: null, startArrowhead: null, endArrowhead: "arrow" }),
    ],
    appState: { viewBackgroundColor: "#ffffff" },
    files: {},
  };

  const messyArrowScene = {
    ...textHeavyScene,
    visualExplainer: transformerDesignMetadata([
      "arrow-1",
      "arrow-2",
      "arrow-3",
      "return-arrow",
      "callout-1",
      "callout-2",
      "callout-3",
      "callout-4",
    ], {
      visualAnchors: [
        { elementId: "block-a", labelElementId: "text-a", role: "input token representation" },
        { elementId: "block-b", labelElementId: "text-b", role: "attention score calculation" },
        { elementId: "block-c", labelElementId: "text-c", role: "layer stack update" },
        { elementId: "block-d", labelElementId: "text-d", role: "context-aware output" },
      ],
    }),
    elements: [
      ...textHeavyScene.elements,
      baseElement({ id: "return-arrow", type: "arrow", x: 905, y: 225, width: -530, height: 160, points: [[0, 0], [-160, 150], [-530, 30]], startBinding: null, endBinding: null, lastCommittedPoint: null, startArrowhead: null, endArrowhead: "arrow" }),
      baseElement({ id: "callout-1", type: "arrow", x: 120, y: 230, width: 0, height: 45, points: [[0, 0], [0, 45]], startBinding: null, endBinding: null, lastCommittedPoint: null, startArrowhead: null, endArrowhead: "arrow" }),
      baseElement({ id: "callout-2", type: "arrow", x: 390, y: 230, width: 0, height: 45, points: [[0, 0], [0, 45]], startBinding: null, endBinding: null, lastCommittedPoint: null, startArrowhead: null, endArrowhead: "arrow" }),
      baseElement({ id: "callout-3", type: "arrow", x: 650, y: 230, width: 0, height: 45, points: [[0, 0], [0, 45]], startBinding: null, endBinding: null, lastCommittedPoint: null, startArrowhead: null, endArrowhead: "arrow" }),
      baseElement({ id: "callout-4", type: "arrow", x: 910, y: 230, width: 0, height: 45, points: [[0, 0], [0, 45]], startBinding: null, endBinding: null, lastCommittedPoint: null, startArrowhead: null, endArrowhead: "arrow" }),
    ],
  };

  const textHeavy = validateVisualExplainerScene(textHeavyScene);
  assert.equal(textHeavy.ok, false);
  assert.match(textHeavy.errors.join("\n"), /at most 70 visible-word equivalents/);

  const messyArrows = validateVisualExplainerScene(messyArrowScene);
  assert.equal(messyArrows.ok, false);
  assert.match(messyArrows.errors.join("\n"), /Bent arrows require/);
});

test("visual explainer scenes reject generic templates without a concept design plan", () => {
  const genericScene = makeOldValidGenericProcessScene();

  const result = validateVisualExplainerScene(genericScene);

  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /visualExplainer design metadata/);
});

test("visual explainer scenes expose diagram pattern and semantic arrow coverage", () => {
  const designedScene = makeTeachingScene({
    metadata: {
      version: 1,
      topic: "gradient descent",
      diagramPattern: "optimization-landscape",
      centralQuestion: "How does a model know which way to change weights?",
      oneSentenceAnswer: "It estimates the loss slope, then repeatedly steps toward lower error.",
      whyThisPattern: "A loss landscape makes slope, direction, and repeated improvement visible without extra prose.",
      readerTakeaways: [
        "Loss height represents error.",
        "The gradient points toward the steepest change.",
        "Training is many small downhill updates.",
      ],
      microExample: "If prediction is too high, the update nudges weights toward lower loss.",
      visualAnchors: [
        { elementId: "point-a", role: "high-loss starting point" },
        { elementId: "point-b", role: "intermediate lower-loss point" },
        { elementId: "point-c", role: "low-loss point" },
        { elementId: "rule-box", labelElementId: "rule-text", role: "update rule" },
        { elementId: "example-box", labelElementId: "example-text", role: "micro-example" },
      ],
      semanticArrows: [
        { elementId: "arrow-1", labelElementId: "arrow-1-label", verb: "steps downhill", from: "high-loss point", to: "lower-loss point" },
        { elementId: "arrow-2", labelElementId: "arrow-2-label", verb: "steps downhill again", from: "middle point", to: "nearer minimum" },
        { elementId: "arrow-3", labelElementId: "arrow-3-label", verb: "uses rule", from: "current position", to: "update rule" },
      ],
      visualEncodings: [
        { channel: "height", meaning: "more vertical means more loss" },
        { channel: "point color", meaning: "red to green means improving error" },
      ],
    },
  });

  const result = validateVisualExplainerScene(designedScene);

  assert.equal(result.ok, true, result.errors.join("\n"));
  assert.equal(result.stats.diagramPattern, "optimization-landscape");
  assert.equal(result.stats.semanticArrowCount, 3);
  assert.equal(result.stats.visualEncodingCount, 2);
});

test("anatomy diagrams reject disguised process flows", () => {
  const processDisguisedAsAnatomy = makeTeachingScene({
    metadata: {
      version: 1,
      topic: "immune response",
      diagramPattern: "anatomy",
      centralQuestion: "How does the immune system respond to an invader?",
      oneSentenceAnswer: "It detects, presents, attacks, and remembers the invader.",
      whyThisPattern: "This claims to be anatomy, but the drawing is a sequence of actions.",
      readerTakeaways: [
        "Detection starts the response.",
        "Antigen presentation activates targeted cells.",
        "Memory makes the next response faster.",
      ],
      microExample: "A vaccine trains memory before the real pathogen arrives.",
      visualAnchors: [
        { elementId: "point-a", role: "first stage" },
        { elementId: "point-b", role: "middle stage" },
        { elementId: "point-c", role: "final stage" },
        { elementId: "rule-box", labelElementId: "rule-text", role: "activation rule" },
        { elementId: "example-box", labelElementId: "example-text", role: "micro-example" },
      ],
      semanticArrows: [
        { elementId: "arrow-1", labelElementId: "arrow-1-label", verb: "triggers", from: "invader", to: "innate response" },
        { elementId: "arrow-2", labelElementId: "arrow-2-label", verb: "activates", from: "presentation", to: "targeted response" },
        { elementId: "arrow-3", labelElementId: "arrow-3-label", verb: "leaves", from: "targeted response", to: "memory" },
      ],
      visualEncodings: [
        { channel: "position", meaning: "later position means later response stage" },
        { channel: "fill color", meaning: "different immune role" },
      ],
    },
  });

  const result = validateVisualExplainerScene(processDisguisedAsAnatomy);

  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /Anatomy diagrams/);
});

test("semantic arrows require visible labels unless they are callout pointers", () => {
  const unlabeledArrows = makeTeachingScene({
    metadata: {
      version: 1,
      topic: "gradient descent",
      diagramPattern: "optimization-landscape",
      centralQuestion: "How does a model know which way to change weights?",
      oneSentenceAnswer: "It estimates the loss slope, then repeatedly steps toward lower error.",
      whyThisPattern: "A loss landscape makes slope, direction, and repeated improvement visible without extra prose.",
      readerTakeaways: [
        "Loss height represents error.",
        "The gradient points toward the steepest change.",
        "Training is many small downhill updates.",
      ],
      microExample: "If prediction is too high, the update nudges weights toward lower loss.",
      visualAnchors: [
        { elementId: "point-a", role: "high-loss starting point" },
        { elementId: "point-b", role: "intermediate lower-loss point" },
        { elementId: "point-c", role: "low-loss point" },
        { elementId: "rule-box", labelElementId: "rule-text", role: "update rule" },
        { elementId: "example-box", labelElementId: "example-text", role: "micro-example" },
      ],
      semanticArrows: [
        { elementId: "arrow-1", verb: "steps downhill", from: "high-loss point", to: "lower-loss point" },
        { elementId: "arrow-2", verb: "steps downhill again", from: "middle point", to: "nearer minimum" },
        { elementId: "arrow-3", verb: "uses rule", from: "current position", to: "update rule" },
      ],
      visualEncodings: [
        { channel: "height", meaning: "more vertical means more loss" },
        { channel: "point color", meaning: "red to green means improving error" },
      ],
    },
  });

  const result = validateVisualExplainerScene(unlabeledArrows);

  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /labelElementId/);
});

test("primary visual anchors require design metadata coverage", () => {
  const sceneWithoutAnchors = makeTeachingScene({
    metadata: {
      version: 1,
      topic: "gradient descent",
      diagramPattern: "optimization-landscape",
      centralQuestion: "How does a model know which way to change weights?",
      oneSentenceAnswer: "It estimates the loss slope, then repeatedly steps toward lower error.",
      whyThisPattern: "A loss landscape makes slope, direction, and repeated improvement visible without extra prose.",
      readerTakeaways: [
        "Loss height represents error.",
        "The gradient points toward the steepest change.",
        "Training is many small downhill updates.",
      ],
      microExample: "If prediction is too high, the update nudges weights toward lower loss.",
      semanticArrows: [
        { elementId: "arrow-1", labelElementId: "arrow-1-label", verb: "steps downhill", from: "high-loss point", to: "lower-loss point" },
        { elementId: "arrow-2", labelElementId: "arrow-2-label", verb: "steps downhill again", from: "middle point", to: "nearer minimum" },
        { elementId: "arrow-3", labelElementId: "arrow-3-label", verb: "uses rule", from: "current position", to: "update rule" },
      ],
      visualEncodings: [
        { channel: "height", meaning: "more vertical means more loss" },
        { channel: "point color", meaning: "red to green means improving error" },
      ],
    },
  });

  const result = validateVisualExplainerScene(sceneWithoutAnchors);

  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /visualAnchors/);
});

test("eval suite covers complex technical and non-technical concepts", async () => {
  const evalPath = path.join(skillRoot, "evals", "evals.json");
  const evalSuite = JSON.parse(await readFile(evalPath, "utf8"));
  const evalText = evalSuite.evals
    .map((evalCase) => `${evalCase.name}\n${evalCase.prompt}\n${evalCase.expected_output}`)
    .join("\n");

  for (const requiredTopic of ["Kubernetes", "OAuth PKCE", "通胀预期", "认知失调", "免疫反应"]) {
    assert.match(evalText, new RegExp(requiredTopic));
  }
});

test("diagram pattern reference teaches transferable visual grammar", async () => {
  const referencePath = path.join(skillRoot, "references", "diagram-patterns.md");
  const reference = await readFile(referencePath, "utf8");

  assert.match(reference, /Visual Grammar/i);
  for (const grammar of ["pressure", "mapping", "boundary", "tension", "landscape", "control loop", "causal field", "cutaway"]) {
    assert.match(reference, new RegExp(grammar, "i"));
  }
  assert.match(reference, /not topic templates/i);
});

test("eval suite covers transferable visual grammar on unfamiliar topics", async () => {
  const evalPath = path.join(skillRoot, "evals", "evals.json");
  const evalSuite = JSON.parse(await readFile(evalPath, "utf8"));
  const evalText = evalSuite.evals
    .map((evalCase) => `${evalCase.name}\n${evalCase.prompt}\n${evalCase.expected_output}\n${evalCase.assertions.join("\n")}`)
    .join("\n");

  for (const requiredTopic of ["database index", "错误预算", "拖延症", "碳循环", "supply and demand"]) {
    assert.match(evalText, new RegExp(requiredTopic));
  }
  for (const requiredAssertion of ["selects_transferable_visual_grammar", "does_not_use_topic_specific_template"]) {
    assert.match(evalText, new RegExp(requiredAssertion));
  }
});
