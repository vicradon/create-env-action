const core = require("@actions/core");
const github = require("@actions/github");
const { readFile, writeFile } = require("node:fs/promises");

async function run() {
  try {
    const inputFileName = core.getInput("action_input_file");
    const outputFileName = core.getInput("action_output_file") || "app.env";

    let fileContent = "";

    if (inputFileName) {
      try {
        fileContent = await readFile(inputFileName, "utf-8");
      } catch (error) {
        console.warn(
          `Failed to read the input file (${inputFileName}): ${error.message}`
        );
      }
    }

    const foundVariables = {};

    const variablesToSkip = [
      "INPUT_action_input_file",
      "INPUT_action_output_file",
    ];

    for (const key in process.env) {
      if (key.startsWith("INPUT_") && !variablesToSkip.includes(key)) {
        const envVarName = key.substring(6); // Remove 'INPUT_' prefix
        const envVarValue = process.env[key];

        // Replace the placeholder in the file if it exists
        const regex = new RegExp(`^${envVarName}=.*`, "gm");
        if (regex.test(fileContent)) {
          fileContent = fileContent.replace(
            regex,
            `${envVarName}=${envVarValue}`
          );
          foundVariables[envVarName] = true;
        } else {
          foundVariables[envVarName] = false;
        }
      }
    }

    // Append missing variables at the end of the file
    for (const key in foundVariables) {
      if (!foundVariables[key]) {
        fileContent += `\n${key}=${process.env[`INPUT_${key}`]}`;
      }
    }

    // Write the modified content to the output file
    await writeFile(outputFileName, fileContent, { encoding: "utf-8" });

    // Set the output file path as an output variable
    core.setOutput("env_file", outputFileName);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
