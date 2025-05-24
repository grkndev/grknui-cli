import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import { downloadComponent, listAvailableComponents } from '../utils/github.js';
import { saveComponent } from '../utils/file.js';

async function addCommand(componentName, options) {
  let selectedComponent = componentName;

  // Eğer component adı verilmemiş ise kullanıcıya liste sun
  if (!selectedComponent) {
    try {
      const spinner = ora('Loading available components...').start();
      const components = await listAvailableComponents();
      spinner.stop();

      if (components.length === 0) {
        console.log(chalk.yellow('No components available.'));
        return;
      }

      const answers = await inquirer.prompt([
        {
          type: 'list',
          name: 'component',
          message: 'Select a component to add:',
          choices: components,
          pageSize: 10
        }
      ]);

      selectedComponent = answers.component;
    } catch (error) {
      console.log(chalk.red(`Error loading components: ${error.message}`));
      return;
    }
  }

  const fileName = `${selectedComponent.toLowerCase()}.tsx`;
  const targetPath = `${options.path}/${fileName}`;

  // Dosya var mı kontrol et
  if (fs.existsSync(targetPath)) {
    try {
      const overwriteAnswer = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: `${chalk.yellow(fileName)} already exists. Overwrite it?`,
          default: false
        }
      ]);

      if (!overwriteAnswer.overwrite) {
        console.log(chalk.blue('✓ Operation cancelled.'));
        process.exit(0);
      }

      // Mevcut dosyayı sil
      try {
        fs.unlinkSync(targetPath);
        console.log(chalk.green('✓ Existing file removed, proceeding with new file...'));
      } catch (deleteError) {
        console.log(chalk.red(`Error deleting existing file: ${deleteError.message}`));
        process.exit(1);
      }
    } catch (error) {
      console.log(chalk.red('Error in confirmation prompt.'));
      process.exit(1);
    }
  }

  const spinner = ora(`Adding ${selectedComponent} component...`).start();

  try {
    const componentContent = await downloadComponent(selectedComponent);

    await saveComponent(targetPath, componentContent);

    spinner.succeed(chalk.green(` ${selectedComponent} component added to ${targetPath}`));

  } catch (error) {
    spinner.fail(chalk.red(`✗ Failed to add ${selectedComponent}: ${error.message}`));
    process.exit(1);
  }
}

export default addCommand;