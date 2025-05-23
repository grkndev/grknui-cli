import fetch from 'node-fetch';

const GITHUB_CONFIG = {
  owner: 'grkndev',
  repo: 'grknui',
  branch: 'main',
  componentsPath: 'src/components'
};

export async function downloadComponent(componentName) {
  const fileName = `${componentName}.tsx`;
  const url = `https://raw.githubusercontent.com/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/${GITHUB_CONFIG.branch}/${GITHUB_CONFIG.componentsPath}/${fileName}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Component "${componentName}" not found in repository`);
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.text();
  } catch (error) {
    if (error.code === 'ENOTFOUND') {
      throw new Error('Network error: Unable to connect to GitHub');
    }
    throw error;
  }
}

export async function listAvailableComponents() {
  const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.componentsPath}`;
  
  try {
    const response = await fetch(url);
    const files = await response.json();
    
    return files
      .filter(file => file.name.endsWith('.tsx'))
      .map(file => file.name.replace('.tsx', ''));
  } catch (error) {
    throw new Error('Unable to fetch available components');
  }
}