#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const DEFAULTS = {
  minWords: 28,
  maxWords: 70,
  minTextElements: 5,
  maxTextElements: 18,
  maxWordsPerTextElement: 18,
  minPrimaryShapes: 4,
  minArrows: 1,
  maxArrows: 9,
  minReaderTakeaways: 3,
  minVisualEncodings: 2,
  minVisualAnchors: 4,
};

const PRIMARY_SHAPES = new Set(["rectangle", "diamond", "ellipse"]);
const ALLOWED_DIAGRAM_PATTERNS = new Set([
  "process-flow",
  "layered-system",
  "feedback-loop",
  "state-machine",
  "comparison",
  "causal-model",
  "mapping",
  "optimization-landscape",
  "anatomy",
  "mental-model",
]);
const PATTERNS_ALLOWING_BENT_ARROWS = new Set(["feedback-loop", "state-machine", "causal-model"]);

function visibleElements(scene) {
  return Array.isArray(scene?.elements) ? scene.elements.filter((element) => !element.isDeleted) : [];
}

function countWords(text) {
  const latinWords = text.match(/[A-Za-z0-9]+(?:['-][A-Za-z0-9]+)?/g) ?? [];
  const cjkChars = text.match(/[\u3400-\u9fff]/g) ?? [];
  return latinWords.length + Math.ceil(cjkChars.length / 2);
}

function textForElement(element) {
  return String(element.text ?? element.originalText ?? "").trim();
}

function isBentConnector(element) {
  return Array.isArray(element.points) && element.points.length > 2;
}

function designMetadata(scene) {
  return scene?.visualExplainer ?? scene?.appState?.visualExplainer ?? null;
}

function nonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validItems(items, requiredKeys) {
  return Array.isArray(items)
    ? items.filter((item) => item && requiredKeys.every((key) => nonEmptyString(item[key])))
    : [];
}

export function analyzeVisualExplainerScene(scene) {
  const elements = visibleElements(scene);
  const textElements = elements.filter((element) => element.type === "text" && textForElement(element));
  const texts = textElements.map(textForElement);
  const wordCount = texts.reduce((total, text) => total + countWords(text), 0);
  const maxWordsInTextElement = texts.reduce((max, text) => Math.max(max, countWords(text)), 0);
  const primaryShapes = elements.filter((element) => PRIMARY_SHAPES.has(element.type));
  const arrows = elements.filter((element) => element.type === "arrow");
  const lines = elements.filter((element) => element.type === "line");
  const bentArrows = arrows.filter(isBentConnector);
  const titleCandidates = textElements.filter((element) => Number(element.fontSize ?? 0) >= 28);
  const design = designMetadata(scene);
  const validSemanticArrows = validItems(design?.semanticArrows, ["elementId", "verb", "from", "to"]);
  const validVisualEncodings = validItems(design?.visualEncodings, ["channel", "meaning"]);
  const validVisualAnchors = validItems(design?.visualAnchors, ["elementId", "role"]);
  const mainSemanticArrows = validSemanticArrows.filter((arrow) => arrow.kind !== "callout-pointer");
  const validReaderTakeaways = Array.isArray(design?.readerTakeaways)
    ? design.readerTakeaways.filter(nonEmptyString)
    : [];
  const textElementIds = new Set(textElements.map((element) => element.id));
  const visibleArrowLabels = validSemanticArrows.filter((arrow) => {
    return nonEmptyString(arrow.labelElementId) && textElementIds.has(arrow.labelElementId);
  });

  return {
    elementCount: elements.length,
    textElementCount: textElements.length,
    wordCount,
    maxWordsInTextElement,
    primaryShapeCount: primaryShapes.length,
    connectorCount: arrows.length,
    arrowCount: arrows.length,
    lineCount: lines.length,
    bentConnectorCount: bentArrows.length,
    bentArrowCount: bentArrows.length,
    hasTitle: titleCandidates.length > 0,
    hasDesignMetadata: !!design && typeof design === "object",
    diagramPattern: design?.diagramPattern ?? null,
    semanticArrowCount: validSemanticArrows.length,
    mainSemanticArrowCount: mainSemanticArrows.length,
    visibleArrowLabelCount: visibleArrowLabels.length,
    visualAnchorCount: validVisualAnchors.length,
    visualEncodingCount: validVisualEncodings.length,
    readerTakeawayCount: validReaderTakeaways.length,
  };
}

export function validateVisualExplainerScene(scene, options = {}) {
  const config = { ...DEFAULTS, ...options };
  const stats = analyzeVisualExplainerScene(scene);
  const errors = [];
  const elements = visibleElements(scene);
  const elementIds = new Set(elements.map((element) => element.id));
  const arrows = elements.filter((element) => element.type === "arrow");
  const arrowIds = new Set(arrows.map((element) => element.id));
  const textElementIds = new Set(elements.filter((element) => element.type === "text").map((element) => element.id));
  const primaryShapeIds = elements.filter((element) => PRIMARY_SHAPES.has(element.type)).map((element) => element.id);
  const design = designMetadata(scene);

  if (stats.wordCount < config.minWords) {
    errors.push(`Use at least ${config.minWords} visible-word equivalents across labels and examples; found ${stats.wordCount}.`);
  }

  if (stats.wordCount > config.maxWords) {
    errors.push(`Use at most ${config.maxWords} visible-word equivalents; found ${stats.wordCount}. Reduce prose and move detail into visual structure.`);
  }

  if (stats.textElementCount < config.minTextElements) {
    errors.push(`Use at least ${config.minTextElements} text elements for title, labels, micro-example, and takeaway; found ${stats.textElementCount}.`);
  }

  if (stats.textElementCount > config.maxTextElements) {
    errors.push(`Use at most ${config.maxTextElements} text elements; found ${stats.textElementCount}. Group visually instead of adding more labels.`);
  }

  if (stats.maxWordsInTextElement > config.maxWordsPerTextElement) {
    errors.push(`Keep each visible text element at ${config.maxWordsPerTextElement} word equivalents or fewer; found ${stats.maxWordsInTextElement}.`);
  }

  if (stats.primaryShapeCount < config.minPrimaryShapes) {
    errors.push(`Use at least ${config.minPrimaryShapes} primary visual anchors for the explanation; found ${stats.primaryShapeCount}.`);
  }

  if (stats.arrowCount < config.minArrows) {
    errors.push(`Use at least ${config.minArrows} arrow to show a relationship or change; found ${stats.arrowCount}.`);
  }

  if (stats.arrowCount > config.maxArrows) {
    errors.push(`Use at most ${config.maxArrows} arrows to avoid visual clutter; found ${stats.arrowCount}.`);
  }

  if (!stats.hasDesignMetadata) {
    errors.push("Add visualExplainer design metadata with topic, diagramPattern, centralQuestion, answer, takeaways, visual encodings, and semantic arrows.");
  } else {
    const requiredStrings = ["topic", "diagramPattern", "centralQuestion", "oneSentenceAnswer", "whyThisPattern", "microExample"];
    for (const key of requiredStrings) {
      if (!nonEmptyString(design[key])) {
        errors.push(`visualExplainer.${key} must be a non-empty string.`);
      }
    }

    if (!ALLOWED_DIAGRAM_PATTERNS.has(design.diagramPattern)) {
      errors.push(`visualExplainer.diagramPattern must be one of: ${Array.from(ALLOWED_DIAGRAM_PATTERNS).join(", ")}.`);
    }

    if (stats.readerTakeawayCount < config.minReaderTakeaways) {
      errors.push(`Add at least ${config.minReaderTakeaways} visualExplainer.readerTakeaways; found ${stats.readerTakeawayCount}.`);
    }

    if (stats.visualEncodingCount < config.minVisualEncodings) {
      errors.push(`Add at least ${config.minVisualEncodings} visualExplainer.visualEncodings that explain what color, position, size, grouping, or shape means; found ${stats.visualEncodingCount}.`);
    }

    const visualAnchors = validItems(design.visualAnchors, ["elementId", "role"]);
    const visualAnchorIds = new Set(visualAnchors.map((anchor) => anchor.elementId));
    if (stats.visualAnchorCount < Math.max(config.minVisualAnchors, stats.primaryShapeCount)) {
      errors.push(`Add visualExplainer.visualAnchors for every primary visual shape; found ${stats.visualAnchorCount} for ${stats.primaryShapeCount} primary shape(s).`);
    }
    for (const anchor of visualAnchors) {
      if (!elementIds.has(anchor.elementId)) {
        errors.push(`visualExplainer.visualAnchors references missing element ${anchor.elementId}.`);
      }
      if (nonEmptyString(anchor.labelElementId) && !textElementIds.has(anchor.labelElementId)) {
        errors.push(`visualExplainer.visualAnchors labelElementId ${anchor.labelElementId} must reference a visible text element.`);
      }
    }
    for (const shapeId of primaryShapeIds) {
      if (!visualAnchorIds.has(shapeId)) {
        errors.push(`Primary shape ${shapeId} is missing a visualExplainer.visualAnchors entry.`);
      }
    }

    const semanticArrows = validItems(design.semanticArrows, ["elementId", "verb", "from", "to"]);
    const mainSemanticArrows = semanticArrows.filter((arrow) => arrow.kind !== "callout-pointer");
    if (design.diagramPattern === "anatomy" && mainSemanticArrows.length > 2) {
      errors.push(
        `Anatomy diagrams should label parts, not encode an ordered sequence with ${mainSemanticArrows.length} main arrows. Use process-flow when steps happen in order.`,
      );
    }
    const semanticArrowIds = new Set(semanticArrows.map((arrow) => arrow.elementId));
    const semanticArrowById = new Map(semanticArrows.map((arrow) => [arrow.elementId, arrow]));
    for (const arrow of arrows) {
      const semanticArrow = semanticArrowById.get(arrow.id);
      if (!semanticArrow) {
        errors.push(`Arrow ${arrow.id} is missing a visualExplainer.semanticArrows entry with verb/from/to.`);
        continue;
      }
      if (semanticArrow.kind !== "callout-pointer") {
        if (!nonEmptyString(semanticArrow.labelElementId)) {
          errors.push(`Arrow ${arrow.id} semantic entry must include labelElementId for a visible arrow label.`);
        } else if (!textElementIds.has(semanticArrow.labelElementId)) {
          errors.push(`Arrow ${arrow.id} labelElementId ${semanticArrow.labelElementId} must reference a visible text element.`);
        }
      }
    }
    for (const semanticArrow of semanticArrows) {
      if (!arrowIds.has(semanticArrow.elementId)) {
        errors.push(`visualExplainer.semanticArrows references missing arrow element ${semanticArrow.elementId}.`);
      }
    }

    if (stats.bentArrowCount > 0 && !PATTERNS_ALLOWING_BENT_ARROWS.has(design.diagramPattern)) {
      errors.push(`Bent arrows require a feedback, state-machine, or causal diagram pattern; found ${stats.bentArrowCount} bent arrow(s) in ${design.diagramPattern}.`);
    }
  }

  if (!stats.hasTitle) {
    errors.push("Use a clear title text element with fontSize 28 or larger.");
  }

  return { ok: errors.length === 0, errors, stats };
}

async function main() {
  const input = process.argv[2];
  if (!input || input === "--help" || input === "-h") {
    console.log("Usage: node validate_visual_explainer_scene.mjs path/to/diagram.excalidraw");
    process.exit(input ? 0 : 1);
  }

  const scene = JSON.parse(await readFile(input, "utf8"));
  const result = validateVisualExplainerScene(scene);
  console.log(JSON.stringify(result.stats, null, 2));

  if (!result.ok) {
    for (const error of result.errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
