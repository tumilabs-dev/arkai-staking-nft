import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

interface PixiElement {
  asset: string;
  x: number;
  y: number;
  index: number;
  initAnimation: string | null;
  idleAnimation: string | null;
  isInteractable: boolean | null;
  scale: number;
}

// Map to store import variable names to their asset paths
type ImportMap = Map<string, string>;

// LayerPositions enum values
const LAYER_POSITIONS: Record<string, number> = {
  UNDERWATER: 1,
  UNDERGROUND: 3,
  GROUND: 5,
  TOP: 10,
};

/**
 * Parse import statements and extract variable-to-path mappings
 */
function parseImports(content: string): ImportMap {
  const importMap = new Map<string, string>();

  // Match import statements like: import VariableName from "@/assets/pool/maps/...";
  const importRegex =
    /import\s+(\w+)\s+from\s+["'](@\/assets\/pool\/maps\/[^"']+)["'];?/g;

  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const variableName = match[1];
    const fullPath = match[2];
    // Convert @/assets/pool/maps/... to /maps/...
    const relativePath = "/" + fullPath.replace(/^@\/assets\/pool\//, "");
    importMap.set(variableName, relativePath);
  }

  return importMap;
}

/**
 * Extract animation function name from initAnimation prop
 * Handles patterns like:
 * - initAnimation={(timeline, sprite, onComplete) => particleEntryAnimation(...)}
 * - initAnimation={particleEntryAnimation}
 * - initAnimation={(timeline, sprite, onComplete) => islandEntryAnimation(timeline, sprite, onComplete, 1)}
 */
function extractAnimationName(initAnimationCode: string): string {
  // Try to match function call pattern: functionName(...)
  const functionCallMatch = initAnimationCode.match(/(\w+)\s*\(/);
  if (functionCallMatch) {
    return functionCallMatch[1];
  }

  // Try to match direct reference: functionName
  const directMatch = initAnimationCode.match(/^\s*(\w+)\s*$/);
  if (directMatch) {
    return directMatch[1];
  }

  return "unknown";
}

/**
 * Extract a complete PixiSpriteWithTexture component including multi-line props
 * Handles both self-closing and full component tags
 */
function extractComponentBlock(
  content: string,
  startIndex: number
): string | null {
  const openTag = "<PixiSpriteWithTexture";
  const start = content.indexOf(openTag, startIndex);
  if (start === -1) return null;

  let inString = false;
  let stringChar = "";
  let braceDepth = 0;
  let parenDepth = 0;
  let i = start;
  let tagStart = start;

  // Find the opening tag end
  while (i < content.length) {
    const char = content[i];
    const prevChar = i > 0 ? content[i - 1] : "";

    if (!inString) {
      if ((char === '"' || char === "'") && prevChar !== "\\") {
        inString = true;
        stringChar = char;
      } else if (char === "{") {
        braceDepth++;
      } else if (char === "}") {
        braceDepth--;
      } else if (char === "(") {
        parenDepth++;
      } else if (char === ")") {
        parenDepth--;
      } else if (char === ">" && braceDepth === 0 && parenDepth === 0) {
        // Check if it's self-closing
        const beforeClose = content.substring(Math.max(0, i - 10), i);
        if (beforeClose.includes("/")) {
          return content.substring(tagStart, i + 1);
        }
        // It's an opening tag, find the closing tag
        const closeTag = "</PixiSpriteWithTexture>";
        const closeIndex = content.indexOf(closeTag, i + 1);
        if (closeIndex === -1) return content.substring(tagStart, i + 1); // Return what we have
        return content.substring(tagStart, closeIndex + closeTag.length);
      }
    } else {
      if (char === stringChar && prevChar !== "\\") {
        inString = false;
        stringChar = "";
      }
    }
    i++;
  }

  return null;
}

/**
 * Extract property value from component string
 */
function extractPropValue(
  componentString: string,
  propName: string
): string | null {
  // Match prop with value, handling both single-line and multi-line
  const regex = new RegExp(`${propName}\\s*=\\s*{([^}]+)}`, "s");
  const match = componentString.match(regex);
  if (match) {
    return match[1].trim();
  }

  // Try simple value without braces
  const simpleRegex = new RegExp(`${propName}\\s*=\\s*{?([^\\s}]+)}?`);
  const simpleMatch = componentString.match(simpleRegex);
  if (simpleMatch) {
    return simpleMatch[1].trim();
  }

  return null;
}

/**
 * Extract PixiSpriteWithTexture components from TSX content
 */
function extractPixiElements(
  content: string,
  importMap: ImportMap,
  componentName: string
): PixiElement[] {
  const elements: PixiElement[] = [];

  let searchIndex = 0;
  let componentBlock: string | null;

  while (
    (componentBlock = extractComponentBlock(content, searchIndex)) !== null
  ) {
    searchIndex =
      content.indexOf(componentBlock, searchIndex) + componentBlock.length;

    // Extract asset prop
    const assetValue = extractPropValue(componentBlock, "asset");
    if (!assetValue) continue;

    // Skip if asset uses property access (like tree.asset) - these are handled by mapped extraction
    if (assetValue.includes(".")) {
      continue;
    }

    // Handle conditional assets (like in checkpoint)
    let assetVariable: string | null = null;
    if (assetValue.includes("?")) {
      // Extract all possible asset variables from ternary
      const variables = assetValue.match(/(\w+)/g);
      if (variables) {
        // Use the last variable as default (usually the fallback)
        assetVariable = variables[variables.length - 1];
      }
    } else {
      assetVariable = assetValue.trim();
    }

    if (!assetVariable) continue;

    let finalAssetPath: string | undefined = importMap.get(assetVariable);

    // If not found and it's a conditional, try to extract all possible paths
    if (!finalAssetPath && assetValue.includes("?")) {
      const allVars = assetValue.match(/(\w+)/g) || [];
      for (const v of allVars) {
        if (importMap.has(v)) {
          finalAssetPath = importMap.get(v)!;
          assetVariable = v;
          break;
        }
      }
    }

    if (!finalAssetPath) {
      console.warn(
        `Warning: Could not find asset path for variable ${assetVariable} in ${componentName}`
      );
      continue;
    }

    // Extract x coordinate
    const xValue = extractPropValue(componentBlock, "x");
    const x = xValue ? parseFloat(xValue) : 0;

    // Extract y coordinate
    const yValue = extractPropValue(componentBlock, "y");
    const y = yValue ? parseFloat(yValue) : 0;

    // Extract zIndex
    const zIndexValue = extractPropValue(componentBlock, "zIndex");
    let zIndex = 0;
    if (zIndexValue) {
      // Check if it's a number
      if (/^\d+$/.test(zIndexValue)) {
        zIndex = parseInt(zIndexValue, 10);
      } else if (zIndexValue.includes("LayerPositions.")) {
        // Extract enum value like LayerPositions.GROUND
        const enumMatch = zIndexValue.match(/LayerPositions\.(\w+)/);
        if (enumMatch) {
          const enumKey = enumMatch[1];
          zIndex = LAYER_POSITIONS[enumKey] || 0;
        }
      }
    }

    // Extract initAnimation
    const initAnimationValue = extractPropValue(
      componentBlock,
      "initAnimation"
    );
    const initAnimation = initAnimationValue
      ? extractAnimationName(initAnimationValue)
      : null;

    // Extract idleAnimation
    const idleAnimationValue = extractPropValue(
      componentBlock,
      "idleAnimation"
    );
    const idleAnimation = idleAnimationValue
      ? extractAnimationName(idleAnimationValue)
      : null;

    // Extract isInteractable
    const isInteractableValue = extractPropValue(
      componentBlock,
      "isInteractable"
    );
    let isInteractable: boolean | null = null;
    if (isInteractableValue) {
      // Handle boolean values: true, false
      if (isInteractableValue.trim() === "true") {
        isInteractable = true;
      } else if (isInteractableValue.trim() === "false") {
        isInteractable = false;
      }
    }

    // Scale defaults to 1
    const scale = 1;

    elements.push({
      asset: finalAssetPath,
      x,
      y,
      index: zIndex,
      initAnimation,
      idleAnimation,
      isInteractable,
      scale,
    });
  }

  return elements;
}

/**
 * Handle mapped elements (like trees in Island_03)
 */
function extractMappedElements(
  content: string,
  importMap: ImportMap
): PixiElement[] {
  const elements: PixiElement[] = [];

  // First, find the array definition - handle multi-line arrays
  const arrayDefRegex = /const\s+(\w+)\s*=\s*\[([\s\S]*?)\];/g;
  let arrayMatch;
  while ((arrayMatch = arrayDefRegex.exec(content)) !== null) {
    const arrayName = arrayMatch[1];
    const arrayContent = arrayMatch[2];

    // Only process arrays that have asset property (like trees array)
    if (!arrayContent.includes("asset:")) continue;

    // Parse array items - handle multi-line format with flexible whitespace
    // Match: { id: "...", asset: VariableName, x: number, y: number }
    const itemRegex =
      /\{\s*id:\s*["']([^"']+)["'],\s*asset:\s*(\w+),\s*x:\s*([\d.]+),\s*y:\s*([\d.]+)\s*\}/gs;
    let itemMatch;
    while ((itemMatch = itemRegex.exec(arrayContent)) !== null) {
      const assetVariable = itemMatch[2];
      const assetPath = importMap.get(assetVariable);
      if (!assetPath) continue;

      const x = parseFloat(itemMatch[3]);
      const y = parseFloat(itemMatch[4]);

      // Find the corresponding map() call to extract animation and zIndex
      // Look for the JSX block that uses this array
      // Match: arrayName.map((param, index) => ...)
      const mapCallPattern = `${arrayName}\\.map\\([^)]*\\)\\s*=>`;
      const mapCallRegex = new RegExp(mapCallPattern, "g");
      const mapCallMatch = mapCallRegex.exec(content);

      let initAnimation: string | null = null;
      let idleAnimation: string | null = null;
      let isInteractable: boolean | null = null;
      let zIndex = 0;

      if (mapCallMatch) {
        // Find the full component block - look for the closing of the map call
        const mapStart = mapCallMatch.index;
        const mapEnd = content.indexOf("))}", mapStart);
        let mapBlock: string | null = null;

        if (mapEnd === -1) {
          // Try alternative closing pattern
          const altEnd = content.indexOf("))", mapStart);
          if (altEnd !== -1) {
            mapBlock = content.substring(mapStart, altEnd);
          }
        } else {
          mapBlock = content.substring(mapStart, mapEnd);
        }

        if (mapBlock) {
          // Extract initAnimation
          const initAnimationValue = extractPropValue(
            mapBlock,
            "initAnimation"
          );
          initAnimation = initAnimationValue
            ? extractAnimationName(initAnimationValue)
            : null;

          // Extract idleAnimation
          const idleAnimationValue = extractPropValue(
            mapBlock,
            "idleAnimation"
          );
          idleAnimation = idleAnimationValue
            ? extractAnimationName(idleAnimationValue)
            : null;

          // Extract isInteractable
          const isInteractableValue = extractPropValue(
            mapBlock,
            "isInteractable"
          );
          if (isInteractableValue) {
            if (isInteractableValue.trim() === "true") {
              isInteractable = true;
            } else if (isInteractableValue.trim() === "false") {
              isInteractable = false;
            }
          }

          // Extract zIndex
          const zIndexValue = extractPropValue(mapBlock, "zIndex");
          if (zIndexValue) {
            if (/^\d+$/.test(zIndexValue)) {
              zIndex = parseInt(zIndexValue, 10);
            } else if (zIndexValue.includes("LayerPositions.")) {
              const enumMatch = zIndexValue.match(/LayerPositions\.(\w+)/);
              if (enumMatch) {
                const enumKey = enumMatch[1];
                zIndex = LAYER_POSITIONS[enumKey] || 0;
              }
            }
          }
        }
      }

      elements.push({
        asset: assetPath,
        x,
        y,
        index: zIndex,
        initAnimation,
        idleAnimation,
        isInteractable,
        scale: 1,
      });
    }
  }

  return elements;
}

/**
 * Extract elements from .map() calls in JSX (like checkpoint_positions.map() or trees.map())
 */
function extractMappedJSXElements(
  content: string,
  importMap: ImportMap
): PixiElement[] {
  const elements: PixiElement[] = [];

  // Find patterns like: {checkpoint_positions.map((position, index) => (...))}
  // or {trees.map((tree, index) => (...))}
  // Match: arrayName.map((param, index) => ...)
  const mapCallRegex = /(\w+)\s*\.\s*map\s*\(\s*\([^)]+\)\s*=>/g;

  let mapMatch;
  while ((mapMatch = mapCallRegex.exec(content)) !== null) {
    const arrayName = mapMatch[1];
    const mapStart = mapMatch.index;

    // Find the array definition - handle multi-line arrays
    const arrayDefRegex = new RegExp(
      `const\\s+${arrayName}\\s*=\\s*\\[([\\s\\S]*?)\\];`,
      "s"
    );
    const arrayDefMatch = content.match(arrayDefRegex);

    if (!arrayDefMatch) continue;

    const arrayContent = arrayDefMatch[1];

    // Check if it's an array of objects with x, y (like checkpoint_positions)
    // or an array with asset, x, y (like trees)
    const hasAsset = arrayContent.includes("asset:");

    if (hasAsset) {
      // Handle arrays like trees with asset, x, y - handle multi-line with flexible whitespace
      const itemRegex =
        /\{\s*id:\s*["']([^"']+)["'],\s*asset:\s*(\w+),\s*x:\s*([\d.]+),\s*y:\s*([\d.]+)\s*\}/gs;
      let itemMatch;

      while ((itemMatch = itemRegex.exec(arrayContent)) !== null) {
        const assetVariable = itemMatch[2];
        const assetPath = importMap.get(assetVariable);
        if (!assetPath) continue;

        const x = parseFloat(itemMatch[3]);
        const y = parseFloat(itemMatch[4]);

        // Find the JSX block for this map call
        const mapBlockEnd = content.indexOf("))}", mapStart);
        if (mapBlockEnd === -1) continue;

        const mapBlock = content.substring(mapStart, mapBlockEnd);

        // Extract zIndex
        const zIndexValue = extractPropValue(mapBlock, "zIndex");
        let zIndex = 0;
        if (zIndexValue) {
          if (/^\d+$/.test(zIndexValue)) {
            zIndex = parseInt(zIndexValue, 10);
          } else if (zIndexValue.includes("LayerPositions.")) {
            const enumMatch = zIndexValue.match(/LayerPositions\.(\w+)/);
            if (enumMatch) {
              const enumKey = enumMatch[1];
              zIndex = LAYER_POSITIONS[enumKey] || 0;
            }
          }
        }

        // Extract initAnimation
        const initAnimationValue = extractPropValue(mapBlock, "initAnimation");
        const initAnimation = initAnimationValue
          ? extractAnimationName(initAnimationValue)
          : null;

        // Extract idleAnimation
        const idleAnimationValue = extractPropValue(mapBlock, "idleAnimation");
        const idleAnimation = idleAnimationValue
          ? extractAnimationName(idleAnimationValue)
          : null;

        // Extract isInteractable
        const isInteractableValue = extractPropValue(
          mapBlock,
          "isInteractable"
        );
        let isInteractable: boolean | null = null;
        if (isInteractableValue) {
          if (isInteractableValue.trim() === "true") {
            isInteractable = true;
          } else if (isInteractableValue.trim() === "false") {
            isInteractable = false;
          }
        }

        elements.push({
          asset: assetPath,
          x,
          y,
          index: zIndex,
          initAnimation,
          idleAnimation,
          isInteractable,
          scale: 1,
        });
      }
    } else {
      // Handle arrays like checkpoint_positions with x, y, width, height
      const itemRegex =
        /\{\s*x:\s*([\d.]+),\s*y:\s*([\d.]+)(?:,\s*width:\s*[\d.]+)?(?:,\s*height:\s*[\d.]+)?\s*\}/g;
      let itemMatch;

      while ((itemMatch = itemRegex.exec(arrayContent)) !== null) {
        const x = parseFloat(itemMatch[1]);
        const y = parseFloat(itemMatch[2]);

        // Find the JSX block for this map call
        const mapBlockEnd = content.indexOf("))}", mapStart);
        if (mapBlockEnd === -1) continue;

        const mapBlock = content.substring(mapStart, mapBlockEnd);

        // Extract asset (might be conditional)
        const assetValue = extractPropValue(mapBlock, "asset");
        if (!assetValue) continue;

        // Extract all possible asset variables from ternary
        let assetPath: string | undefined;
        if (assetValue.includes("?")) {
          const variables = assetValue.match(/(\w+)/g) || [];
          // Try to find all asset variables and use the first one found
          for (const v of variables) {
            if (importMap.has(v)) {
              assetPath = importMap.get(v)!;
              break;
            }
          }
        } else {
          const assetVariable = assetValue.trim();
          assetPath = importMap.get(assetVariable);
        }

        if (!assetPath) continue;

        // Extract zIndex
        const zIndexValue = extractPropValue(mapBlock, "zIndex");
        let zIndex = 0;
        if (zIndexValue) {
          if (/^\d+$/.test(zIndexValue)) {
            zIndex = parseInt(zIndexValue, 10);
          } else if (zIndexValue.includes("LayerPositions.")) {
            const enumMatch = zIndexValue.match(/LayerPositions\.(\w+)/);
            if (enumMatch) {
              const enumKey = enumMatch[1];
              zIndex = LAYER_POSITIONS[enumKey] || 0;
            }
          }
        }

        // Extract initAnimation
        const initAnimationValue = extractPropValue(mapBlock, "initAnimation");
        const initAnimation = initAnimationValue
          ? extractAnimationName(initAnimationValue)
          : null;

        // Extract idleAnimation
        const idleAnimationValue = extractPropValue(mapBlock, "idleAnimation");
        const idleAnimation = idleAnimationValue
          ? extractAnimationName(idleAnimationValue)
          : null;

        // Extract isInteractable
        const isInteractableValue = extractPropValue(
          mapBlock,
          "isInteractable"
        );
        let isInteractable: boolean | null = null;
        if (isInteractableValue) {
          if (isInteractableValue.trim() === "true") {
            isInteractable = true;
          } else if (isInteractableValue.trim() === "false") {
            isInteractable = false;
          }
        }

        elements.push({
          asset: assetPath,
          x,
          y,
          index: zIndex,
          initAnimation,
          idleAnimation,
          isInteractable,
          scale: 1,
        });
      }
    }
  }

  return elements;
}

/**
 * Process a single TSX file
 */
function processFile(filePath: string, componentName: string): PixiElement[] {
  const content = readFileSync(filePath, "utf-8");
  const importMap = parseImports(content);

  const elements: PixiElement[] = [];

  // Extract regular PixiSpriteWithTexture components
  elements.push(...extractPixiElements(content, importMap, componentName));

  // Extract mapped elements from array definitions (like Island_03 trees)
  elements.push(...extractMappedElements(content, importMap));

  // Extract mapped JSX elements (like checkpoint_positions.map())
  elements.push(...extractMappedJSXElements(content, importMap));

  return elements;
}

/**
 * Main function
 */
function main() {
  const files = [
    {
      path: join(
        projectRoot,
        "src/components/playground/parts/pool-1/Island_01.tsx"
      ),
      name: "Island_01",
    },
    {
      path: join(
        projectRoot,
        "src/components/playground/parts/pool-1/Island_02.tsx"
      ),
      name: "Island_02",
    },
    {
      path: join(
        projectRoot,
        "src/components/playground/parts/pool-1/Island_03.tsx"
      ),
      name: "Island_03",
    },
  ];

  const allElements: PixiElement[] = [];

  for (const file of files) {
    console.log(`Processing ${file.name}...`);
    try {
      const elements = processFile(file.path, file.name);
      allElements.push(...elements);
      console.log(`  Found ${elements.length} elements`);
    } catch (error) {
      console.error(`Error processing ${file.name}:`, error);
    }
  }

  // Write to JSON file
  const outputPath = join(projectRoot, "pixi-elements.json");
  writeFileSync(outputPath, JSON.stringify(allElements, null, 2), "utf-8");

  console.log(`\nExported ${allElements.length} elements to ${outputPath}`);
}

main();
