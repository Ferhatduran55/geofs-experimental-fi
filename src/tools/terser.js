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

function sourceMap(file) {
  return {
    filename: `${file}.min.js`,
    url: `${file}.min.js.map`,
  };
}

function savePath(file) {
  return output.status ? `${output.save_path}/${file}` : `${file}`;
}

function getPath(file) {
  return file.split("/").slice(0, -1).join("/");
}

async function minifyFile(source, mapping = false) {
  let reduced = false,
    changed = false,
    file = source.src ?? source;
  try {
    const code = fs.readFileSync(`${file}.js`, "utf8");
    config.sourceMap = mapping ? sourceMap(savePath(file)) : false;
    const minified = await minify(code, config);
    const outputPath = getPath(savePath(file));
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }
    fs.writeFileSync(`${savePath(file)}.min.js`, minified.code);
    if (mapping) {
      fs.writeFileSync(`${savePath(file)}.min.js.map`, minified.map);
    }
    reduced = true;
  } catch (error) {
    const { message, filename, line, col, pos } = error;
    console.log(`Error: ${message} at ${filename}:${line}:${col}:${pos}`);
    reduced = false;
  }

  if (
    reduced &&
    output.replace &&
    source.replace &&
    source.replace.from &&
    source.replace.to
  ) {
    const replace = source.replace;
    const request = replacer({
      files: `${savePath(file)}.min.js`,
      from: replace.from,
      to: replace.to,
      use: replace.use ?? [],
    });
    changed = (await request).response ?? false;
    if (changed) {
      console.log(
        `${changed[0].numMatches} matches found, changed ${
          changed[0].numReplacements
        } times, Replaced ${changed[1].from} with ${
          changed[1].to
        } in ${savePath(file)}.min.js`
      );
    }
  }

  let res = {
    source: file,
    reduced: reduced,
    mapped: mapping,
    changed: changed,
  };
  return res;
}

async function minifyAll(sources, mapping = false) {
  sources.forEach((source) => {
    minifyFile(source, mapping);
  });
}

minifyAll(sources, output.map);
