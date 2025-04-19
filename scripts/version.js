const child_process = require("child_process");
const fs = require("fs");

const COMMIT_ID = child_process.execSync("git rev-parse HEAD").toString().trim().slice(0, 7);
const { version, version_tag } = require("../package.json");
const Year = new Date().getFullYear();
const tag = version_tag;

console.log(`
> Version: ${version}
> Commit: ${COMMIT_ID}
> Year: ${Year}
> Tags: ${tag || "None"}
`);

let fullVersion;

if (tag) {
   fullVersion = `${Year}.${version}-${tag}`;
} else {
    fullVersion = `${Year}.${version}`;
}

console.log(`> Full version: ${fullVersion}`);
const writeString = `local module = { version = "${fullVersion}", commit_id = "${COMMIT_ID}" }; return module;`;
const outfile = "/out/shared/version.lua";
console.log(`Writing version to ${outfile}...`);
fs.writeFile(`.${outfile}`, writeString, { encoding: "utf-8" }, err => {
    if (err) {
        return console.error(err);
    }
});
console.log("Done!");