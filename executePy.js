const { spawn } = require("child_process");

const executePy = (filepath) => {
  return new Promise((resolve, reject) => {
    const process = spawn("python", [filepath]);

    let output = "";
    let errorOutput = "";

    process.stdout.on("data", (data) => {
      output += data.toString();
    });

    process.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    process.on("close", (code) => {
      if (code !== 0 || errorOutput) {
        console.error("Python execution error:", errorOutput);
        reject({ error: 'Python execution error', stderr: errorOutput });
      } else {
        resolve(output);
      }
    });
  });
};

module.exports = {
  executePy,
};
