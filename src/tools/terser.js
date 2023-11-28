const { minify } = require("terser");
const fs = require("fs");
const { argv } = require("process");
const { options } = require("../config");
const replacer = require("./replacer");

const { config, output } = options.terser;
const sources = output.sources;

argv.forEach((arg) => {
  if (arg === "--output" || arg === "-o") {
    output.status = true;
  }
  if (arg === "--save-path" || arg === "-s") {
    output.save_path = argv[argv.indexOf(arg) + 1];
  }
  if (arg === "--replace" || arg === "-r") {
    output.replace = true;
  }
  if (arg === "--map" || arg === "-m") {
    output.map = true;
  }
});

function createSourceMap(file) {
  return {
    filename: file,
    url: `${file}.map`,
  };
}

function savePath(file) {
  return output.status ? `${output.save_path}/${file}` : `${file}`;
}

function getPath(file) {
  return file.split("/").slice(0, -1).join("/");
}

function getFileName(file) {
  return file.split("/").pop().split(".").slice(0, -1).join(".");
}

function getFileExtension(file) {
  return file.split(".").pop();
}

async function minifyFile(source, mapping = false) {
  let isReduced = false;
  let file = source.src ?? source;

  try {
    const directory = getPath(file);
    const fileName = getFileName(file);
    const ext = getFileExtension(file);

    const outputPath =
      source.min === false && source.min !== undefined
        ? savePath(`${directory}/${fileName}.${ext}`).replace(/^\//, "")
        : savePath(`${directory}/${fileName}.min.${ext}`).replace(/^\//, "");
    const code = await fs.promises.readFile(file, "utf8");
    config.sourceMap =
      mapping && source.map !== false ? createSourceMap(outputPath) : false;
    const minified = await minify(code, config);

    await createDirectoryIfNotExists(savePath(directory));
    await writeToFile(outputPath, minified.code);

    if (mapping && source.map !== false) {
      await writeToFile(`${outputPath}.map`, minified.map);
    }

    isReduced = true;
    file = outputPath;
  } catch (error) {
    const { message, filename, line, col, pos } = error;
    console.log(`Error: ${message} at ${filename}:${line}:${col}:${pos}`);
    isReduced = false;
  }

  if (
    isReduced &&
    output.replace &&
    source.replace &&
    source.replace.from &&
    source.replace.to
  ) {
    const replace = source.replace;
    const request = replacer({
      files: file,
      from: replace.from,
      to: replace.to,
      use: replace.use ?? [],
    });
    const changed = (await request).response ?? false;
    if (changed) {
      console.log(
        `${changed[0].numMatches} matches found, changed ${changed[0].numReplacements} times, Replaced ${changed[1].from} with ${changed[1].to} in ${file}.`
      );
    }
  }
}

async function createDirectoryIfNotExists(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    await fs.promises.mkdir(directoryPath, { recursive: true });
  }
}

async function writeToFile(filePath, content) {
  await fs.promises.writeFile(filePath, content);
}

async function minifyAll(sources, mapping = false) {
  sources.forEach((source) => {
    minifyFile(source, mapping);
  });
}

minifyAll(sources, output.map);
