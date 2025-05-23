import chalk from 'chalk';
import ora from 'ora';
import { downloadComponent } from '../utils/github.js';
import { saveComponent } from '../utils/file.js';

async function addCommand(componentName, options) {
  const spinner = ora(`Adding ${componentName} component...`).start();
  
  try {
    // Component adını normalize et (Button -> button.tsx)
    const fileName = `${componentName.toLowerCase()}.tsx`;
    const targetPath = `${options.path}/${fileName}`;
    
    // GitHub'dan component'i indir
    const componentContent = await downloadComponent(componentName);
    
    // Component'i kaydet
    await saveComponent(targetPath, componentContent);
    
    spinner.succeed(chalk.green(`✓ ${componentName} component added to ${targetPath}`));
    
    console.log(chalk.blue('\nNext steps:'));
    console.log(chalk.gray(`• Import: import { ${componentName} } from './${options.path}/${fileName.replace('.tsx', '')}';`));
    
  } catch (error) {
    spinner.fail(chalk.red(`✗ Failed to add ${componentName}: ${error.message}`));
    process.exit(1);
  }
}

export default addCommand;