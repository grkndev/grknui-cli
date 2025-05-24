#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import addCommand from '../src/commands/add.js';
import { listAvailableComponents } from '../src/utils/github.js';

const program = new Command();

program
  .name('grknui')
  .description('CLI for Grkn UI Kit')
  .version("1.0.3");

program
  .command('add')
  .description('Add a component to your project')
  .argument('[component]', 'component name to add (optional)')
  .option('-p, --path <path>', 'custom path for components', 'components/ui')
  .action(addCommand);

program
  .command('list')
  .description('List available components')
  .action(async () => {
    try {
      const components = await listAvailableComponents();
      console.log(chalk.blue('\nAvailable components:'));
      components.forEach(comp => console.log(chalk.green(`• ${comp}`)));
    } catch (error) {
      console.log(chalk.red(`Error: ${error.message}`));
    }
  });

program.parse();