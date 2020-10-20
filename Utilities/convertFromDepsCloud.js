const fs = require('fs')
      path = require('path')

const depsInputPath =
    process.env.MARINER_DEPSCLOUD_INPUT ||
    path.join(__dirname, '..', 'InputFiles', 'candidate.json');
const depsOutputPath =
    process.env.MARINER_DEPSCLOUD_OUTPUT ||
    path.join(__dirname, '..', 'OutputFiles', 'candidate-converted.json');

function convert(deps) {
  result = {};
  for(var item in deps) {
    // Format may change?
    var first = deps[item].repository_url;
    var second = deps[item].score;
    // Assuming all URIs would have a double slash, we follow the slashes to get owner and repo
    firstpull = first.split("//")[1];
    cut = firstpull.split("/")[2]
    if (cut.includes(".git")) {
      cut = cut.split(".")[0]
    }
    first = firstpull.split("/")[1] + "/" + cut;
    console.log("** ITEM: " + first);
    result[first] = second;
  }
  //Final JSON Product
  return JSON.stringify(result, null, 4)
}

//Read file, send it out,and get it back
function gather() {
  const depsInput = fs.readFileSync(depsInputPath, {
    encoding: 'utf8',
  })
  deps = JSON.parse(depsInput)
  built = convert(deps)
  fs.writeFileSync(depsOutputPath, built)
  return "Success! The file is in the DepsCloud directory"
}

module.exports = {
  gather
};

gather();
