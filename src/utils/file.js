import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { confirmOverwrite } from './prompt.js';

export async function saveComponent(targetPath, content) {
  try {
    // Dizinin var olduğundan emin ol
    const directory = path.dirname(targetPath);
    await fs.ensureDir(directory);
    
    // Dosya zaten varsa kullanıcıya sor
    if (await fs.pathExists(targetPath)) {
      const shouldOverwrite = await confirmOverwrite(targetPath);
      if (!shouldOverwrite) {
        throw new Error('Operation cancelled by user');
      }
    }
    
    // Dosyayı kaydet
    await fs.writeFile(targetPath, content, 'utf8');
    
  } catch (error) {
    throw new Error(`Failed to save component: ${error.message}`);
  }
}

// Proje tipini kontrol et (Next.js, React, vb.)
export function detectProjectType() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = fs.readJsonSync(packageJsonPath);
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    if (dependencies.next) return 'next';
    if (dependencies.react) return 'react';
    if (dependencies.vue) return 'vue';
  }
  
  return 'unknown';
}