import chalk from 'chalk';
import ora from 'ora';
import { downloadComponent } from '../utils/github.js';
import { saveComponent } from '../utils/file.js';

async function addCommand(componentName, options) {
  const spinner = ora(`Adding ${componentName} component...`).start();

  try {
    const fileName = `${componentName.toLowerCase()}.tsx`;
    const targetPath = `${options.path}/${fileName}`;

    const componentContent = await downloadComponent(componentName);

    await saveComponent(targetPath, componentContent);

    spinner.succeed(chalk.green(` ${componentName} component added to ${targetPath}`));

  } catch (error) {
    spinner.fail(chalk.red(`✗ Failed to add ${componentName}: ${error.message}`));
    process.exit(1);
  }
}

export default addCommand;