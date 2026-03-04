// ============================================================================
// Imports
// ============================================================================

import { spawnSync } from 'child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { parse } from 'jsonc-parser';
import { join } from 'path';
import type { PackageContent, PackageManagers } from './types.js';

// ============================================================================
// Constants and paths
// ============================================================================

const cwd = process.cwd();
const eslintConfigPath = join(cwd, 'eslint.config.ts');
const vscodePath = join(cwd, '.vscode');
const vscodeSettingsPath = join(vscodePath, 'settings.json');
const vscodeExtensionsPath = join(vscodePath, 'extensions.json');
const packagePath = join(cwd, 'package.json');
const defaultEslintConfig = readFileSync(new URL('../eslint.config.ts', import.meta.url), 'utf-8');

// ============================================================================
// Utility functions
// ============================================================================

const throwError = (...message: any[]) => {
  console.error(...message);
  process.exit(1);
};

const readJson = (path: string) => {
  if (!existsSync(path)) return {};
  return parse(readFileSync(path, 'utf-8'));
};

const setScript = (
  pkg: PackageContent,
  name: string,
  value: string,
) => {
  pkg.scripts ??= {};
  if (pkg.scripts[name]) {
    console.info(`👀 The script \`${name}\` already exists, overwriting it...`);
  }
  pkg.scripts[name] = value;
};

const run = (command: string, args: string[]) => {
  if (process.platform === 'win32') {
    return spawnSync(
      'cmd.exe',
      ['/d', '/s', '/c', `${command}.cmd`, ...args],
      { stdio: 'inherit' },
    );
  }
  return spawnSync(command, args, { stdio: 'inherit' });
};

// ============================================================================
// Package validation
// ============================================================================

if (!existsSync(packagePath)) {
  throwError('💔 Missing `package.json`!');
}
const initialPackageContent = readJson(packagePath) as PackageContent;
if (!initialPackageContent || Object.keys(initialPackageContent).length === 0) {
  throwError('💔 Missing `package.json`!');
}
if (
  initialPackageContent.packageManager
  && typeof initialPackageContent.packageManager !== 'string'
) {
  throwError('💔 Invalid `package.json`!');
}

// ============================================================================
// Package manager detection
// ============================================================================

const packageManagerLocks: [PackageManagers, string][] = [
  ['yarn', 'yarn.lock'],
  ['pnpm', 'pnpm-lock.yaml'],
  ['bun', 'bun.lockb'],
] as const;

const detectPackageManager = (): PackageManagers => {
  for (const [manager, lock] of packageManagerLocks) {
    if (
      initialPackageContent.packageManager?.startsWith(manager)
      || existsSync(join(cwd, lock))
    ) {
      return manager;
    }
  }
  return 'npm';
};

const packageManager = detectPackageManager();

const buildInstallCommand = (packages: string[]): { command: string; args: string[]; } => {
  const args = packageManager === 'npm'
    ? ['install', '-D', ...packages]
    : ['add', '-D', ...packages];
  return { command: packageManager, args };
};

// ============================================================================
// Dependencies to install
// ============================================================================

const dependenciesToInstall = [
  '@dprint/dockerfile',
  '@dprint/json',
  '@dprint/markdown',
  '@dprint/typescript',
  '@eslint/compat',
  '@types/node',
  'dprint-plugin-malva',
  'dprint-plugin-markup',
  'dprint-plugin-yaml',
  'eslint',
  'eslint-plugin-format',
  'jiti',
  'sass',
  'typescript',
];

const { command, args } = buildInstallCommand(dependenciesToInstall);

// ============================================================================
// Main setup execution
// ============================================================================

console.info('✨ Injecting Yurai Template...');

// Install dependencies
const result = run(command, args);

if (result.error) {
  throwError(['💔 Failed to install dependencies!', result.error].join('\n'));
}
if (result.status !== 0) {
  throwError(`Exit code: ${result.status}`);
}

// ============================================================================
// VS Code configuration
// ============================================================================

// Create `.vscode` directory
mkdirSync(vscodePath, { recursive: true });

// Configure VS Code settings
const defaultVscodeSettings = {
  'editor.codeActionsOnSave': {
    'source.fixAll': 'always',
    'source.removeUnusedImports': 'always',
  },
  'eslint.validate': [
    'javascript',
    'javascriptreact',
    'typescript',
    'typescriptreact',
    'json',
    'jsonc',
    'markdown',
    'mdc',
    'dockerfile',
    'css',
    'scss',
    'less',
    'html',
    'vue',
    'svelte',
    'astro',
    'jinja',
    'twig',
    'nunjucks',
    'vento',
    'mustache',
    'xml',
    'yaml',
  ],
};

const existingVscodeSettings = readJson(vscodeSettingsPath);
const finalVscodeSettings = { ...existingVscodeSettings, ...defaultVscodeSettings };
if (JSON.stringify(finalVscodeSettings) !== JSON.stringify(existingVscodeSettings)) {
  console.info('👀 Writing updated VS Code settings...');
}
writeFileSync(vscodeSettingsPath, JSON.stringify(finalVscodeSettings, null, 2) + '\n');

// Configure VS Code extensions
const recommendedExtensions = ['dbaeumer.vscode-eslint'];
const existingExtensions = readJson(vscodeExtensionsPath);
existingExtensions.recommendations ??= [];

let addedExtensions = false;
for (const extension of recommendedExtensions) {
  if (!existingExtensions.recommendations.includes(extension)) {
    addedExtensions = true;
    existingExtensions.recommendations.push(extension);
  }
}
if (addedExtensions) {
  console.info('👀 Adding VS Code extension recommendation...');
}
writeFileSync(vscodeExtensionsPath, JSON.stringify(existingExtensions, null, 2) + '\n');

// ============================================================================
// ESLint configuration
// ============================================================================

if (!existsSync(eslintConfigPath)) {
  writeFileSync(eslintConfigPath, defaultEslintConfig);
} else {
  console.info('👀 `eslint.config.ts` already exists, skipping creation...');
}

// ============================================================================
// `package.json` scripts setup
// ============================================================================

const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8')) as PackageContent;
setScript(packageJson, 'lint', 'eslint .');
setScript(packageJson, 'lint:fix', 'eslint . --fix');
writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');

// ============================================================================
// Completion
// ============================================================================

console.info('✨ Yurai Template injected successfully!');
