const { options } = require("../config");
const replace = require("replace-in-file");

const config = options["replace-in-file"];

async function replacer({ files, use, from = [], to = [] }) {
  let results, error, replaced;

  use = Array.isArray(use) ? use : [];

  let fromToGenerated = use.flatMap((u) => {
    let ref = config.references.find((r) => r.use === u);
    if (ref) {
      if (ref.group) {
        return Object.keys(config.variables)
          .filter((key) => key.startsWith(`${u}:`))
          .map((key) => [`{@${key}}`, `@var:${key};`]);
      } else {
        return [[ref.from, ref.to]];
      }
    }
    return [];
  });

  let fromGenerated = fromToGenerated.map(([from]) => from);
  let toGenerated = fromToGenerated.map(([_, to]) => to);

  from = [...from, ...fromGenerated];
  to = [...to, ...toGenerated];

  to = to.map((t) => {
    return t.replace(/@var:([^;]*);/g, (match, varName) => {
      return config.variables[varName] || "";
    });
  });

  const options = {
    files: files,
    from: Array.isArray(from)
      ? from.map((f) => new RegExp(f, "g"))
      : new RegExp(from, "g"),
    to: to,
    countMatches: config.countMatches ?? false,
  };

  try {
    results = await replace(options);
    results = results.concat(options);
    replaced = true;
  } catch (error) {
    replaced = false;
  }
  return { status: replaced, response: results ?? error };
}

exports = module.exports = replacer;
