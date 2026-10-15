#!/usr/bin/env node

// =============================================================================
// Imports
// =============================================================================

import { parse } from 'jsonc-parser';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';
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
  pnpmWorkspaceYaml: join(cwd, 'pnpm-workspace.yaml'),
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
    console.info('- Detecting package manager...');

    for (const [manager, lock] of packageManagerLocks) {
      if (
        initialPackageContent.packageManager?.startsWith(manager) ||
        existsSync(join(cwd, lock))
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
    console
      .info(`  - The script \`${name}\` already exists, overwriting it...`);
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
    console.info('- Updating VS Code settings...');
  } else {
    console.info('- Creating VS Code settings...');
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
    console.info('- Updating VS Code extension recommendations...');
  } else {
    console.info('- Creating VS Code extension recommendations...');
  }
  writeFileSync(
    paths.vscodeExtensions,
    JSON.stringify(existingExtensions, null, 2) + '\n',
  );
};

const setupEslintConfig = () => {
  if (existsSync(paths.eslintConfig)) {
    console.info('- Updating `eslint.config.ts`...');
  } else {
    console.info('- Creating `eslint.config.ts`...');
  }
  writeFileSync(paths.eslintConfig, defaultEslintConfig);
};

const setupPackageJsonScripts = () => {
  console.info('- Setting up `package.json` scripts...');

  const packageJson = JSON
    .parse(readFileSync(paths.packageJson, 'utf-8')) as PackageContent;
  setScript(packageJson, 'lint', 'eslint .');
  setScript(packageJson, 'lint:fix', 'eslint . --fix');
  writeFileSync(paths.packageJson, JSON.stringify(packageJson, null, 2) + '\n');
};

const setupPnpmWorkspaceYaml = () => {
  const defaultPnpmWorkspaceConfig =
    "allowBuilds:\n  '@parcel/watcher': true\n";

  if (!existsSync(paths.pnpmWorkspaceYaml)) {
    console.info('- Creating `pnpm-workspace.yaml`...');
    writeFileSync(paths.pnpmWorkspaceYaml, defaultPnpmWorkspaceConfig);
    return;
  }

  const content = readFileSync(paths.pnpmWorkspaceYaml, 'utf-8');

  if (/['"]?@parcel\/watcher['"]?\s*:\s*true/.test(content)) {
    return;
  }

  console.info('- Updating `pnpm-workspace.yaml`...');

  const allowBuildsMatch = content.match(/^(\s*)allowBuilds:\s*$/m);
  if (allowBuildsMatch && allowBuildsMatch.index !== undefined) {
    const indent = allowBuildsMatch[1] || '';
    const insertPos = allowBuildsMatch.index + allowBuildsMatch[0].length;
    const itemToAdd = `\n${indent}  '@parcel/watcher': true`;
    let newContent = content.slice(0, insertPos) + itemToAdd +
      content.slice(insertPos);
    if (!newContent.endsWith('\n')) {
      newContent += '\n';
    }
    writeFileSync(paths.pnpmWorkspaceYaml, newContent);
    return;
  }

  const separator = content.length === 0
    ? ''
    : content.endsWith('\n\n')
    ? ''
    : content.endsWith('\n')
    ? '\n'
    : '\n\n';

  writeFileSync(
    paths.pnpmWorkspaceYaml,
    `${content}${separator}${defaultPnpmWorkspaceConfig}`,
  );
};

// =============================================================================
// Package validation and initialization
// =============================================================================

const validatePackageJson = (): PackageContent => {
  console.info('- Validating `package.json`...');

  if (!existsSync(paths.packageJson)) {
    throwError('  - Missing `package.json`!');
  }
  const packageContent = readJson(paths.packageJson) as PackageContent;
  if (
    !packageContent ||
    Object.keys(packageContent).length === 0 ||
    packageContent.packageManager &&
      typeof packageContent.packageManager !== 'string'
  ) {
    throwError('  - Invalid `package.json`!');
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
    console.log(`- ${pkg.version}`);
    process.exit(0);
  }

  console.info('- Injecting Yurai Template...');

  // Validate package.json
  const initialPackageContent = validatePackageJson();

  // Detect package manager and install dependencies
  const packageManager = detectPackageManager(initialPackageContent);

  if (packageManager === 'pnpm') {
    setupPnpmWorkspaceYaml();
  }

  const { command, args } = buildInstallCommand(
    packageManager,
    dependenciesToInstall,
  );
  console.info('- Installing dependencies...');
  const result = run(command, args);

  if (result.error) {
    throwError(['  - Failed to install dependencies!', result.error]
      .join('\n'));
  }
  if (result.status !== 0) {
    throwError(`  - Failed to install dependencies! Exit code: ${result.status}`);
  }

  // Setup configuration files
  setupVscodeSettings();
  setupVscodeExtensions();
  setupEslintConfig();
  setupPackageJsonScripts();

  console.info('- Yurai Template injected successfully!');
};

main();
