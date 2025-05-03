#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const crypto = require('crypto');

// Configuration
const config = {
  // Directories and files to ignore
  ignoreDirs: [
    'node_modules',
    '.git',
    '.next',
    'out',
    'build',
    'dist',
    '.turbo',
    '.vercel',
    'coverage',
    '.cache',
    '.github',
    'public/static'
  ],
  ignoreFiles: [
    '.DS_Store',
    'yarn.lock',
    'package-lock.json',
    '.gitignore',
    '.env.local',
    '.env.development',
    '.env.production'
  ],
  // File extensions to focus on
  relevantExtensions: [
    '.js',
    '.jsx',
    '.ts',
    '.tsx',
    '.css',
    '.scss',
    '.sass',
    '.less',
    '.json',
    '.md',
    '.html',
    '.svg',
    '.prisma',
    '.graphql',
    '.env.example'
  ],
  // Number of lines to show from each file
  previewLines: 6,
  // Max file size to analyze in bytes (5MB)
  maxFileSize: 5 * 1024 * 1024,
  // Max depth for directory traversal
  maxDepth: 10
};

// Analysis results
const analysis = {
  totalFiles: 0,
  totalDirs: 0,
  fileTypes: {},
  frameworkDetection: {
    next: false,
    typescript: false,
    styling: [],
    stateManagement: [],
    testing: []
  },
  largeFiles: [],
  importPatterns: {},
  componentCount: 0,
  pageCount: 0,
  apiCount: 0
};

// Create output directory for results
const OUTPUT_DIR = path.join(process.cwd(), '.codebase-analysis');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}

// Patterns to detect frameworks and libraries
const patterns = {
  next: [
    'next',
    'next/router',
    'next/link',
    'next/image',
    'next/head',
    'next/document',
    'next/app'
  ],
  react: [
    'react',
    'react-dom',
    'useState',
    'useEffect',
    'useContext',
    'useReducer',
    'useCallback',
    'useMemo'
  ],
  stateManagement: {
    redux: ['redux', 'react-redux', 'createStore', 'useSelector', 'useDispatch'],
    mobx: ['mobx', 'observer', 'observable'],
    recoil: ['recoil', 'useRecoilState', 'useRecoilValue'],
    zustand: ['zustand', 'create', 'useStore'],
    jotai: ['jotai', 'useAtom'],
    contextApi: ['createContext', 'useContext']
  },
  styling: {
    tailwind: ['tailwindcss', 'tailwind.config', 'className="'],
    styledComponents: ['styled-components', 'styled.'],
    emotion: ['@emotion', 'css`'],
    sass: ['.scss', '.sass'],
    css: ['.module.css', '.css']
  },
  testing: {
    jest: ['jest', 'test(', 'describe(', 'it(', 'expect('],
    rtl: ['@testing-library/react', 'render(', 'screen.'],
    cypress: ['cypress', 'cy.']
  }
};

// Interactive CLI
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function promptQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function runAnalysis() {
  console.log('\n🔍 Next.js Project Analyzer 🔍\n');
    
  const includePreview = await promptQuestion('Show file previews? (y/n): ');
  const showPreviews = includePreview.toLowerCase() === 'y';
  
  const includeImports = await promptQuestion('Analyze imports and dependencies? (y/n): ');
  const analyzeImports = includeImports.toLowerCase() === 'y';
  
  const generateMarkdown = await promptQuestion('Generate markdown summary report? (y/n): ');
  const shouldGenerateMarkdown = generateMarkdown.toLowerCase() === 'y';
  
  console.log('\n📊 Analyzing your Next.js React application...\n');
  
  const rootDir = process.cwd();
  const structure = {};
  const startTime = Date.now();
  
  // Get package.json data
  try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
    analysis.packageInfo = {
      name: packageJson.name,
      version: packageJson.version,
      dependencies: Object.keys(packageJson.dependencies || {}),
      devDependencies: Object.keys(packageJson.devDependencies || {})
    };
    
    // Detect frameworks from dependencies
    analysis.frameworkDetection.next = 
      analysis.packageInfo.dependencies.includes('next') ||
      Object.keys(packageJson.dependencies || {}).some(dep => dep === 'next');
    
    analysis.frameworkDetection.typescript = 
      analysis.packageInfo.dependencies.includes('typescript') || 
      analysis.packageInfo.devDependencies.includes('typescript') ||
      fs.existsSync(path.join(rootDir, 'tsconfig.json'));
      
    // Check state management
    for (const [state, patterns] of Object.entries(patterns.stateManagement)) {
      if ([...analysis.packageInfo.dependencies, ...analysis.packageInfo.devDependencies]
          .some(dep => patterns.some(pattern => dep.includes(pattern)))) {
        analysis.frameworkDetection.stateManagement.push(state);
      }
    }
    
    // Check testing frameworks
    for (const [test, testPatterns] of Object.entries(patterns.testing)) {
      if ([...analysis.packageInfo.dependencies, ...analysis.packageInfo.devDependencies]
          .some(dep => testPatterns.some(pattern => dep.includes(pattern)))) {
        analysis.frameworkDetection.testing.push(test);
      }
    }
    
  } catch (error) {
    console.log('⚠️ No package.json found or error reading it.');
    analysis.packageInfo = { error: 'Not found or invalid' };
  }
  
  // Get project structure
  exploreDirectory(rootDir, structure, 0);
  
  // Print the structure
  console.log('📁 Project Structure:\n');
  printStructure(structure, 0);
  
  const endTime = Date.now();
  
  // Generate summary 
  console.log('\n📊 Project Summary:');
  console.log(`• Total Files: ${analysis.totalFiles}`);
  console.log(`• Total Directories: ${analysis.totalDirs}`);
  console.log(`• Components: ${analysis.componentCount}`);
  console.log(`• Pages: ${analysis.pageCount}`);
  console.log(`• API Routes: ${analysis.apiCount}`);
  
  console.log('\n📚 Tech Stack:');
  console.log(`• Framework: Next.js ${analysis.frameworkDetection.next ? '✅' : '❓'}`);
  console.log(`• TypeScript: ${analysis.frameworkDetection.typescript ? '✅' : '❌'}`);
  
  if (analysis.frameworkDetection.stateManagement.length > 0) {
    console.log(`• State Management: ${analysis.frameworkDetection.stateManagement.join(', ')}`);
  }
  
  if (analysis.frameworkDetection.styling.length > 0) {
    console.log(`• Styling: ${analysis.frameworkDetection.styling.join(', ')}`);
  }
  
  if (analysis.frameworkDetection.testing.length > 0) {
    console.log(`• Testing: ${analysis.frameworkDetection.testing.join(', ')}`);
  }
  
  console.log('\n📋 File Types:');
  Object.entries(analysis.fileTypes)
    .sort((a, b) => b[1] - a[1])
    .forEach(([ext, count]) => {
      console.log(`• ${ext}: ${count} files`);
    });
  
  if (analysis.largeFiles.length > 0) {
    console.log('\n⚠️ Large Files (>500KB):');
    analysis.largeFiles.forEach(file => {
      console.log(`• ${file.path} (${(file.size/1024).toFixed(1)}KB)`);
    });
  }
  
  if (analyzeImports && Object.keys(analysis.importPatterns).length > 0) {
    console.log('\n🔄 Top Import Dependencies:');
    Object.entries(analysis.importPatterns)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([imp, count]) => {
        console.log(`• ${imp}: used in ${count} files`);
      });
  }
  
  console.log(`\n✅ Analysis complete in ${((endTime - startTime)/1000).toFixed(2)}s`);
  
  // Generate markdown report
  if (shouldGenerateMarkdown) {
    const markdownPath = path.join(OUTPUT_DIR, 'codebase-analysis.md');
    generateMarkdownReport(markdownPath);
    console.log(`\n📝 Markdown report generated: ${markdownPath}`);
  }
  
  rl.close();
}

function exploreDirectory(dirPath, result, depth = 0) {
  if (depth > config.maxDepth) return;
  
  const relativePath = path.relative(process.cwd(), dirPath);
  const dirName = relativePath || '.';
  
  if (depth === 0 || !config.ignoreDirs.some(dir => {
      const normalizedDirPath = dirPath.replace(/\\/g, '/');
      return normalizedDirPath.includes(`/${dir}/`) || normalizedDirPath.endsWith(`/${dir}`);
    })) {
    
    let entries;
    try {
      entries = fs.readdirSync(dirPath, { withFileTypes: true });
    } catch (error) {
      console.error(`Error reading directory ${dirPath}: ${error.message}`);
      return;
    }
    
    if (depth === 0) {
      analysis.totalDirs = 1; // Count root
    }
    
    // First add directories
    for (const entry of entries.filter(e => e.isDirectory())) {
      if (!config.ignoreDirs.includes(entry.name)) {
        analysis.totalDirs++;
        const newPath = path.join(dirPath, entry.name);
        result[entry.name] = {};
        exploreDirectory(newPath, result[entry.name], depth + 1);
        
        // Remove empty directories
        if (Object.keys(result[entry.name]).length === 0) {
          delete result[entry.name];
        }
      }
    }
    
    // Then add files
    for (const entry of entries.filter(e => e.isFile())) {
      if (config.ignoreFiles.includes(entry.name)) continue;
      
      const ext = path.extname(entry.name).toLowerCase();
      if (config.relevantExtensions.includes(ext) || ext === '') {
        const filePath = path.join(dirPath, entry.name);
        const relativeFilePath = path.relative(process.cwd(), filePath);
        
        // Skip files larger than maxFileSize
        const stats = fs.statSync(filePath);
        if (stats.size > config.maxFileSize) {
          result[entry.name] = `[Large File: ${(stats.size/1024/1024).toFixed(2)}MB]`;
          analysis.largeFiles.push({
            path: relativeFilePath,
            size: stats.size
          });
          continue;
        }
        
        // Count file types
        analysis.fileTypes[ext] = (analysis.fileTypes[ext] || 0) + 1;
        analysis.totalFiles++;
        
        // Detect components and pages
        if (ext === '.jsx' || ext === '.tsx' || ext === '.js' || ext === '.ts') {
          if (relativeFilePath.includes('/components/') || 
              entry.name.match(/[A-Z][a-z]+/) && !entry.name.startsWith('index')) {
            analysis.componentCount++;
          }
          if (relativeFilePath.includes('/pages/') || relativeFilePath.includes('/app/')) {
            if (relativeFilePath.includes('/api/')) {
              analysis.apiCount++;
            } else {
              analysis.pageCount++;
            }
          }
        }
        
        // Detect styling frameworks
        if (ext === '.css' || ext === '.scss' || ext === '.sass' || ext === '.less') {
          for (const [style, stylePatterns] of Object.entries(patterns.styling)) {
            if (!analysis.frameworkDetection.styling.includes(style) && 
                stylePatterns.some(pattern => entry.name.includes(pattern))) {
              analysis.frameworkDetection.styling.push(style);
            }
          }
        }
        
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          
          // Analyze file content
          analyzeFileContent(content, ext, relativeFilePath);
          
          if (result[entry.name] !== `[Large File: ${(stats.size/1024/1024).toFixed(2)}MB]`) {
            const lines = content.split('\n').slice(0, config.previewLines);
            result[entry.name] = lines.join('\n');
            
            // Add file hash to detect duplicates
            const hash = crypto.createHash('md5').update(content).digest('hex');
            result[entry.name] = {
              preview: lines.join('\n'),
              size: stats.size,
              hash: hash
            };
          }
        } catch (error) {
          result[entry.name] = `[Error reading file: ${error.message}]`;
        }
      }
    }
  }
}

function analyzeFileContent(content, ext, filePath) {
  // Skip large files to avoid memory issues
  if (content.length > config.maxFileSize) return;
  
  // Look for import patterns
  if (['.js', '.jsx', '.ts', '.tsx'].includes(ext)) {
    // Match import statements
    const importRegex = /import\s+(?:{[^}]*}|\*\s+as\s+\w+|\w+)\s+from\s+['"]([^'"]+)['"]/g;
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1];
      if (!importPath.startsWith('.')) { // External dependency
        analysis.importPatterns[importPath] = (analysis.importPatterns[importPath] || 0) + 1;
      }
    }
    
    // Check for framework patterns
    for (const [framework, frameworkPatterns] of Object.entries(patterns)) {
      if (Array.isArray(frameworkPatterns)) {
        for (const pattern of frameworkPatterns) {
          if (content.includes(pattern)) {
            if (framework === 'next' && !analysis.frameworkDetection.next) {
              analysis.frameworkDetection.next = true;
            }
            break;
          }
        }
      }
    }
    
    // Detect styling
    for (const [style, stylePatterns] of Object.entries(patterns.styling)) {
      if (!analysis.frameworkDetection.styling.includes(style)) {
        for (const pattern of stylePatterns) {
          if (content.includes(pattern)) {
            analysis.frameworkDetection.styling.push(style);
            break;
          }
        }
      }
    }
    
    // Detect state management
    for (const [state, statePatterns] of Object.entries(patterns.stateManagement)) {
      if (!analysis.frameworkDetection.stateManagement.includes(state)) {
        for (const pattern of statePatterns) {
          if (content.includes(pattern)) {
            analysis.frameworkDetection.stateManagement.push(state);
            break;
          }
        }
      }
    }
    
    // Detect testing
    for (const [test, testPatterns] of Object.entries(patterns.testing)) {
      if (!analysis.frameworkDetection.testing.includes(test)) {
        for (const pattern of testPatterns) {
          if (content.includes(pattern)) {
            analysis.frameworkDetection.testing.push(test);
            break;
          }
        }
      }
    }
  }
  
  // Check if it's a config file
  if (filePath === 'tailwind.config.js' || filePath === 'tailwind.config.ts') {
    if (!analysis.frameworkDetection.styling.includes('tailwind')) {
      analysis.frameworkDetection.styling.push('tailwind');
    }
  }
}

function printStructure(obj, level) {
  const entries = Object.entries(obj);
  const dirs = entries.filter(([_, value]) => typeof value === 'object' && !value.hasOwnProperty('preview'));
  const files = entries.filter(([_, value]) => typeof value !== 'object' || value.hasOwnProperty('preview'));
  
  // Print directories first
  for (const [key, value] of dirs) {
    const indent = '  '.repeat(level);
    console.log(`${indent}📁 ${key}/`);
    printStructure(value, level + 1);
  }
  
  // Then print files
  for (const [key, value] of files) {
    const indent = '  '.repeat(level);
    
    if (typeof value === 'string') {
      if (value.startsWith('[Large File') || value.startsWith('[Error')) {
        console.log(`${indent}📄 ${key} ${value}`);
      } else {
        console.log(`${indent}📄 ${key}`);
      }
    } else if (value && typeof value === 'object') {
      const sizeKb = (value.size / 1024).toFixed(1);
      console.log(`${indent}📄 ${key} (${sizeKb}KB)`);
      
      if (value.preview) {
        console.log(`${indent}   ┌${'─'.repeat(30)}`);
        console.log(value.preview.split('\n').map(line => `${indent}   │ ${line}`).join('\n'));
        console.log(`${indent}   └${'─'.repeat(30)}`);
      }
    }
  }
}

function generateMarkdownReport(outputPath) {
  let markdown = `# Project Analysis Report\n\n`;
  markdown += `Generated on ${new Date().toLocaleString()}\n\n`;
  
  // Project overview
  markdown += `## Project Overview\n\n`;
  if (analysis.packageInfo && !analysis.packageInfo.error) {
    markdown += `- **Name**: ${analysis.packageInfo.name || 'N/A'}\n`;
    markdown += `- **Version**: ${analysis.packageInfo.version || 'N/A'}\n`;
  }
  markdown += `- **Total Files**: ${analysis.totalFiles}\n`;
  markdown += `- **Total Directories**: ${analysis.totalDirs}\n`;
  markdown += `- **Components**: ${analysis.componentCount}\n`;
  markdown += `- **Pages**: ${analysis.pageCount}\n`;
  markdown += `- **API Routes**: ${analysis.apiCount}\n\n`;
  
  // Tech stack
  markdown += `## Tech Stack\n\n`;
  markdown += `- **Framework**: Next.js ${analysis.frameworkDetection.next ? '✅' : '❓'}\n`;
  markdown += `- **TypeScript**: ${analysis.frameworkDetection.typescript ? '✅' : '❌'}\n`;
  
  if (analysis.frameworkDetection.stateManagement.length > 0) {
    markdown += `- **State Management**: ${analysis.frameworkDetection.stateManagement.join(', ')}\n`;
  }
  
  if (analysis.frameworkDetection.styling.length > 0) {
    markdown += `- **Styling**: ${analysis.frameworkDetection.styling.join(', ')}\n`;
  }
  
  if (analysis.frameworkDetection.testing.length > 0) {
    markdown += `- **Testing**: ${analysis.frameworkDetection.testing.join(', ')}\n`;
  }
  markdown += '\n';
  
  // Dependencies
  if (analysis.packageInfo && analysis.packageInfo.dependencies) {
    markdown += `## Main Dependencies\n\n`;
    analysis.packageInfo.dependencies.slice(0, 15).forEach(dep => {
      markdown += `- ${dep}\n`;
    });
    if (analysis.packageInfo.dependencies.length > 15) {
      markdown += `- ... and ${analysis.packageInfo.dependencies.length - 15} more\n`;
    }
    markdown += '\n';
  }
  
  // File types
  markdown += `## File Types\n\n`;
  Object.entries(analysis.fileTypes)
    .sort((a, b) => b[1] - a[1])
    .forEach(([ext, count]) => {
      markdown += `- **${ext || 'no extension'}**: ${count} files\n`;
    });
  markdown += '\n';
  
  // Large files
  if (analysis.largeFiles.length > 0) {
    markdown += `## Large Files (>500KB)\n\n`;
    analysis.largeFiles.forEach(file => {
      markdown += `- \`${file.path}\` (${(file.size/1024).toFixed(1)}KB)\n`;
    });
    markdown += '\n';
  }
  
  // Import patterns
  if (Object.keys(analysis.importPatterns).length > 0) {
    markdown += `## Top Import Dependencies\n\n`;
    Object.entries(analysis.importPatterns)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .forEach(([imp, count]) => {
        markdown += `- **${imp}**: used in ${count} files\n`;
      });
    markdown += '\n';
  }
  
  // Write to file
  fs.writeFileSync(outputPath, markdown);
}

// Run the analysis
runAnalysis();