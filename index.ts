#!/usr/bin/env node

// =============================================================================
// Imports
// =============================================================================

import { spawnSync } from 'child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { parse } from 'jsonc-parser';
import { join } from 'path';
import type { PackageContent, PackageManagers } from './types.js';

// =============================================================================
// Paths
// =============================================================================

const cwd = process.cwd();
const paths = {
  eslintConfig: join(cwd, 'eslint.config.ts'),
  vscode: join(cwd, '.vscode'),
  vscodeSettings: join(cwd, '.vscode', 'settings.json'),
  vscodeExtensions: join(cwd, '.vscode', 'extensions.json'),
  packageJson: join(cwd, 'package.json'),
} as const;

// =============================================================================
// Configuration
// =============================================================================

const defaultEslintConfig = readFileSync(
  new URL('../eslint.config.ts', import.meta.url),
  'utf-8',
);

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
} as const;

const recommendedExtensions = ['dbaeumer.vscode-eslint'] as const;
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
] as const;

const packageManagerLocks: [PackageManagers, string][] = [
  ['yarn', 'yarn.lock'],
  ['pnpm', 'pnpm-lock.yaml'],
  ['bun', 'bun.lockb'],
] as const;

// =============================================================================
// Utility functions
// =============================================================================

const throwError = (...message: any[]) => {
  console.error(...message);
  process.exit(1);
};

const readJson = (path: string) => {
  if (!existsSync(path)) return {};
  return parse(readFileSync(path, 'utf-8'));
};

const run = (command: string, args: string[]) => {
  if (process.platform === 'win32') {
    return spawnSync('cmd.exe', ['/d', '/s', '/c', `${command}.cmd`, ...args], {
      stdio: 'inherit',
    });
  }
  return spawnSync(command, args, { stdio: 'inherit' });
};

// =============================================================================
// Package manager utilities
// =============================================================================

const detectPackageManager =
  (initialPackageContent: PackageContent): PackageManagers => {
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

const buildInstallCommand = (
  packageManager: PackageManagers,
  packages: readonly string[],
): { command: string; args: string[]; } => {
  const args = packageManager === 'npm'
    ? ['install', '-D', ...packages]
    : ['add', '-D', ...packages];
  return { command: packageManager, args };
};

// =============================================================================
// Package.json utilities
// =============================================================================

const setScript = (pkg: PackageContent, name: string, value: string) => {
  pkg.scripts ??= {};
  if (pkg.scripts[name]) {
    console.info(`👀 The script \`${name}\` already exists, overwriting it...`);
  }
  pkg.scripts[name] = value;
};

// =============================================================================
// VS Code setup utilities
// =============================================================================

const setupVscodeSettings = () => {
  mkdirSync(paths.vscode, { recursive: true });

  const existingSettings = readJson(paths.vscodeSettings);
  const finalSettings = { ...existingSettings, ...defaultVscodeSettings };

  if (JSON.stringify(finalSettings) !== JSON.stringify(existingSettings)) {
    console.info('👀 Writing updated VS Code settings...');
  }
  writeFileSync(
    paths.vscodeSettings,
    JSON.stringify(finalSettings, null, 2) + '\n',
  );
};

const setupVscodeExtensions = () => {
  mkdirSync(paths.vscode, { recursive: true });

  const existingExtensions = readJson(paths.vscodeExtensions);
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
  writeFileSync(
    paths.vscodeExtensions,
    JSON.stringify(existingExtensions, null, 2) + '\n',
  );
};

const setupEslintConfig = () => {
  if (!existsSync(paths.eslintConfig)) {
    writeFileSync(paths.eslintConfig, defaultEslintConfig);
  } else {
    console.info('👀 `eslint.config.ts` already exists, skipping creation...');
  }
};

const setupPackageJsonScripts = () => {
  const packageJson = JSON
    .parse(readFileSync(paths.packageJson, 'utf-8')) as PackageContent;
  setScript(packageJson, 'lint', 'eslint .');
  setScript(packageJson, 'lint:fix', 'eslint . --fix');
  writeFileSync(paths.packageJson, JSON.stringify(packageJson, null, 2) + '\n');
};

// =============================================================================
// Package validation and initialization
// =============================================================================

const validatePackageJson = (): PackageContent => {
  if (!existsSync(paths.packageJson)) {
    throwError('💔 Missing `package.json`!');
  }
  const packageContent = readJson(paths.packageJson) as PackageContent;
  if (
    !packageContent
    || Object.keys(packageContent).length === 0
    || packageContent.packageManager
      && typeof packageContent.packageManager !== 'string'
  ) {
    throwError('💔 Invalid `package.json`!');
  }
  return packageContent;
};

// =============================================================================
// Main setup execution
// =============================================================================

const main = () => {
  // Check for version flag
  if (process.argv.includes('--version') || process.argv.includes('-v')) {
    const pkg = JSON
      .parse(readFileSync(
        new URL('../package.json', import.meta.url),
        'utf-8',
      ));
    console.log(`❤️ ${pkg.version}`);
    process.exit(0);
  }

  console.info('✨ Injecting Yurai Template...');

  // Validate package.json
  const initialPackageContent = validatePackageJson();

  // Detect package manager and install dependencies
  const packageManager = detectPackageManager(initialPackageContent);
  const { command, args } = buildInstallCommand(
    packageManager,
    dependenciesToInstall,
  );
  const result = run(command, args);

  if (result.error) {
    throwError(['💔 Failed to install dependencies!', result.error].join('\n'));
  }
  if (result.status !== 0) {
    throwError(`Exit code: ${result.status}`);
  }

  // Setup configuration files
  setupVscodeSettings();
  setupVscodeExtensions();
  setupEslintConfig();
  setupPackageJsonScripts();

  console.info('✨ Yurai Template injected successfully!');
};

main();
