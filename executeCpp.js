const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "compiled_executables");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filepath) => {
  const jobId = path.basename(filepath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.exe`); // Use .exe extension for the output file

  return new Promise((resolve, reject) => {
    exec(
      `g++ "${filepath}" -o "${outPath}"`,
      (compilationError, compilationStdout, compilationStderr) => {
        if (compilationError || compilationStderr) {
          const compilationErrorMessage = compilationStderr || compilationError.message;
          reject({ error: compilationErrorMessage });
        } else {
          exec(`"${outPath}"`, (executionError, executionStdout, executionStderr) => {
            if (executionError || executionStderr) {
              const executionErrorMessage = executionStderr || executionError.message;
              reject({ error: executionErrorMessage });
            } else {
              resolve(executionStdout.trim()); // Trim any leading/trailing whitespaces or newlines
            }
          });
        }
      }
    );
  });
};

module.exports = {
  executeCpp,
};
