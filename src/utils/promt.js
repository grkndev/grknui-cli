import readline from 'readline';

export function createPrompt() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

export function askQuestion(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

export async function confirmOverwrite(filePath) {
  const rl = createPrompt();
  const answer = await askQuestion(
    rl, 
    `File ${filePath} already exists. Overwrite? (y/N): `
  );
  rl.close();
  
  return answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes';
}