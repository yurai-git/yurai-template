## dprint-plugin-typescript

- Add the following options with the value `'whenNotSingleLine'`
  - `forInStatement.useBraces`
  - `forOfStatement.useBraces`
  - `forStatement.useBraces`
  - `ifStatement.useBraces`
  - `whileStatement.useBraces`
- Add the following options with the value `'sameLine'`
  - `arrowFunction.bracePosition`
  - `classDeclaration.bracePosition`
  - `classExpression.bracePosition`
  - `constructor.bracePosition`
  - `doWhileStatement.bracePosition`
  - `enumDeclaration.bracePosition`
  - `forInStatement.bracePosition`
  - `forOfStatement.bracePosition`
  - `forStatement.bracePosition`
  - `functionDeclaration.bracePosition`
  - `functionExpression.bracePosition`
  - `getAccessor.bracePosition`
  - `ifStatement.bracePosition`
  - `interfaceDeclaration.bracePosition`
  - `moduleDeclaration.bracePosition`
  - `method.bracePosition`
  - `setAccessor.bracePosition`
  - `staticBlock.bracePosition`
  - `switchStatement.bracePosition`
  - `switchCase.bracePosition`
  - `tryStatement.bracePosition`
  - `whileStatement.bracePosition`
- Add the following options with the value `'sameLine'`
  - `forInStatement.singleBodyPosition`
  - `forOfStatement.singleBodyPosition`
  - `forStatement.singleBodyPosition`
  - `ifStatement.singleBodyPosition`
  - `whileStatement.singleBodyPosition`
- Add the following options with the value `'sameLine'`
  - `ifStatement.nextControlFlowPosition`
  - `tryStatement.nextControlFlowPosition`
  - `doWhileStatement.nextControlFlowPosition`
- Add the following options with the value `'onlyMultiLine'`
  - `arguments.trailingCommas`
  - `parameters.trailingCommas`
  - `arrayExpression.trailingCommas`
  - `arrayPattern.trailingCommas`
  - `enumDeclaration.trailingCommas`
  - `exportDeclaration.trailingCommas`
  - `importDeclaration.trailingCommas`
  - `objectExpression.trailingCommas`
  - `objectPattern.trailingCommas`
  - `tupleType.trailingCommas`
  - `typeLiteral.trailingCommas`
  - `typeParameters.trailingCommas`
- Add the following options with the value `'nextLine'`
  - `binaryExpression.operatorPosition`
  - `conditionalExpression.operatorPosition`
  - `conditionalType.operatorPosition`
- Add the following options with the value `false`
  - `arrayPattern.preferHanging`
  - `doWhileStatement.preferHanging`
  - `exportDeclaration.preferHanging`
  - `extendsClause.preferHanging`
  - `forInStatement.preferHanging`
  - `forOfStatement.preferHanging`
  - `forStatement.preferHanging`
  - `ifStatement.preferHanging`
  - `implementsClause.preferHanging`
  - `importDeclaration.preferHanging`
  - `jsxAttributes.preferHanging`
  - `objectExpression.preferHanging`
  - `objectPattern.preferHanging`
- Add the following options with the value `false`
  - `sequenceExpression.preferHanging`
  - `switchStatement.preferHanging`
  - `typeLiteral.preferHanging`
  - `unionAndIntersectionType.preferHanging`
  - `variableStatement.preferHanging`
  - `whileStatement.preferHanging`
- Add the following options with the value `true`
  - `arrayExpression.preferSingleLine`
  - `arrayPattern.preferSingleLine`
  - `arguments.preferSingleLine`
  - `binaryExpression.preferSingleLine`
  - `computed.preferSingleLine`
  - `conditionalExpression.preferSingleLine`
  - `conditionalType.preferSingleLine`
  - `decorators.preferSingleLine`
  - `exportDeclaration.preferSingleLine`
  - `forStatement.preferSingleLine`
  - `importDeclaration.preferSingleLine`
  - `jsxAttributes.preferSingleLine`
  - `jsxElement.preferSingleLine`
  - `mappedType.preferSingleLine`
  - `memberExpression.preferSingleLine`
  - `objectPattern.preferSingleLine`
  - `parameters.preferSingleLine`
  - `parentheses.preferSingleLine`
  - `tupleType.preferSingleLine`
  - `typeLiteral.preferSingleLine`
  - `typeParameters.preferSingleLine`
  - `unionAndIntersectionType.preferSingleLine`
  - `variableStatement.preferSingleLine`
- Add the `objectExpression.preferSingleLine` option with the value `false`
- Add the following options with the value `'nextLine'`
  - `jsxOpeningElement.bracketPosition`
  - `jsxSelfClosingElement.bracketPosition`
- Add the following options with the value `'semiColon'`
  - `typeLiteral.separatorKind.singleLine`
  - `typeLiteral.separatorKind.multiLine`
- Add the following options with the value `false`
  - `arguments.spaceAround`
  - `arrayExpression.spaceAround`
  - `arrayPattern.spaceAround`
  - `catchClause.spaceAround`
  - `doWhileStatement.spaceAround`
  - `forInStatement.spaceAround`
  - `forOfStatement.spaceAround`
  - `forStatement.spaceAround`
  - `ifStatement.spaceAround`
  - `parameters.spaceAround`
  - `parenExpression.spaceAround`
  - `switchStatement.spaceAround`
  - `tupleType.spaceAround`
  - `whileStatement.spaceAround`
- Add the following options with the value `true`
  - `objectExpression.spaceSurroundingProperties`
  - `objectPattern.spaceSurroundingProperties`
  - `typeLiteral.spaceSurroundingProperties`
- Add the `functionExpression.flatIife` option with the value `false`

## dprint-plugin-json

- Add the following options with the value `false`
  - `array.preferSingleLine`
  - `object.preferSingleLine`

## dprint-plugin-markdown

- Add the `wrapUnspacedScripts` option with the value `false`
- Rename the `unorderedListKind` option to `list.unorderedMarker`
- Rename the `headingKind` option to `heading.kind`
- Add the `hardBreakKind` option with the value `'backslash'`
- Add the `maxBlankLines` option with the vaule `1`
- Add the `heading.blankLinesAbove` option with the value `1`
- Add the `list.indentKind` option with the value `'commonMark'`
- Add the `codeBlock.skipFormat` option with the value `false`
- Add the `codeBlock.raiseSyntaxErrors` option with the value `false`
- Add the `codeBlock.preserveIndentation` option with the value `false`
- Add the `codeBlock.preserveBlankLines` option with the value `false`
- Add the `codeBlock.useTabs` option with the value `false`
- Add the `codeBlock.indentWidth` option with the value `2`
- Add the `html.skipFormat` option with the value `false`
- Add the `html.useTabs` option with the value `false`
- Add the `html.indentWidth` option with the value `2`
- Add the `html.selfClosingSpace` option with the value `true`
- Add the `html.preferSingleLine` option with the value `false`
- Add the `table.skipFormat` option with the value `false`
- Add the `table.cellPadding` option with the value `'align'`

## dprint-plugin-dockerfile

- Add the `healthcheckCmdNewLine` option with the value `false`
- Add the `indentStages` option with the value `false`
- Add the `indentWidth` option with the value `2`

## Malva

- Add the following options with the value `true`
  - `selectors.preferSingleLine`
  - `functionArgs.preferSingleLine`
- Add the `lessImportOptions` option with the value `true`
- Add the `fontFamilyNames` option with the value `'consistent'`
- Add the `nthPlusSpacing` option with the value `true`

## markup_fmt

- Add the following options with the value `false`
  - `vue.scriptIndent`
  - `vue.styleIndent`
- Add the following options with the value `true`
  - `svelte.scriptIndent`
  - `astro.scriptIndent`
  - `svelte.styleIndent`
  - `astro.styleIndent`
- Add the `component.whitespaceSensitivity` option with the value `'ignore'`
- Add the following options with the value `'short'`
  - `component.vSlotStyle`
  - `default.vSlotStyle`
  - `named.vSlotStyle`

## Pretty YAML

- Add the following options with the value `false`
  - `flowSequence.preferSingleLine`
  - `flowMap.preferSingleLine`
