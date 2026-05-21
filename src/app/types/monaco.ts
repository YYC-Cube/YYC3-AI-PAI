/**
 * @file monaco.ts
 * @description Monaco Editor类型定义，避免使用any
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-24
 * @updated 2026-03-24
 * @status stable
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags types,monaco,editor
 */

export namespace MonacoEditor {
  export interface IStandaloneCodeEditor {
    getModel(): ITextModel | null
    setValue(value: string): void
    getValue(): string
    getSelection(): Selection | null
    setPosition(pos: IPosition): void
    getPosition(): Position | null
    deltaDecorations(oldDecorations: string[], newDecorations: IModelDeltaDecoration[]): string[]
    getOption<T>(id: number): T
    onDidChangeModelContent(listener: (e: IModelContentChangedEvent) => void): IDisposable
    onDidChangeCursorPosition(listener: (e: ICursorPositionChangedEvent) => void): IDisposable
    onDidChangeCursorSelection(listener: (e: ICursorSelectionChangedEvent) => void): IDisposable
    focus(): void
    layout(dimension?: IDimension): void
    dispose(): void
    getDomNode(): HTMLElement | null
    getEditorType(): string
  }

  export interface ITextModel {
    getValue(): string
    setValue(value: string): void
    getLineCount(): number
    getLineContent(lineNumber: number): string
    getLineMaxColumn(lineNumber: number): number
    getOffsetAt(position: IPosition): number
    getPositionAt(offset: number): Position
    getFullModelRange(): Range
    onDidChangeContent(listener: (e: IModelContentChangedEvent) => void): IDisposable
    dispose(): void
  }

  export interface IModelDeltaDecoration {
    range: IRange
    options: IModelDecorationOptions
  }

  export interface IModelDecorationOptions {
    className?: string
    hoverMessage?: string | IMarkdownString[]
    glyphMarginHoverMessage?: string | IMarkdownString[]
    stickiness?: number
    beforeContentClassName?: string
    afterContentClassName?: string
    inlineClassName?: string
    isWholeLine?: boolean
    zIndex?: number
    overviewRuler?: { color: string; position: number }
  }

  export interface IRange {
    startLineNumber: number
    startColumn: number
    endLineNumber: number
    endColumn: number
  }

  export interface IPosition {
    lineNumber: number
    column: number
  }

  export interface IDimension {
    width: number
    height: number
  }

  export interface Selection extends IRange {
    selectionStartLineNumber: number
    selectionStartColumn: number
    positionLineNumber: number
    positionColumn: number
  }

  export interface Position {
    lineNumber: number
    column: number
  }

  export interface Range {
    startLineNumber: number
    startColumn: number
    endLineNumber: number
    endColumn: number
  }

  export interface IDisposable {
    dispose(): void
  }

  export interface ICursorPositionChangedEvent {
    position: Position
    secondaryPositions: Position[]
    reason: number
    source: string
  }

  export interface ICursorSelectionChangedEvent {
    selection: Selection
    secondarySelections: Selection[]
    source: string
    reason: number
  }

  export interface IModelContentChangedEvent {
    changes: IModelContentChange[]
    isUndoing: boolean
    isRedoing: boolean
  }

  export interface IModelContentChange {
    range: IRange
    rangeOffset: number
    rangeLength: number
    text: string
  }

  export interface IMarkdownString {
    value: string
    isTrusted?: boolean
  }
}

export namespace MonacoLanguages {
  export interface CodeActionProvider {
    provideCodeActions(
      model: MonacoEditor.ITextModel,
      range: MonacoEditor.Range,
      context: CodeActionContext,
      token: MonacoCancellationToken
    ): CodeActionList | null | undefined | Promise<CodeActionList | null | undefined>
  }

  export interface CodeActionContext {
    markers: IMarker[]
    only?: string
    trigger?: number
  }

  export interface CodeActionList extends MonacoEditor.IDisposable {
    actions: CodeAction[]
  }

  export interface CodeAction {
    title: string
    kind?: string
    diagnostics?: IMarker[]
    isPreferred?: boolean
  }

  export interface IMarker {
    code?: string
    severity: number
    message: string
    startLineNumber: number
    startColumn: number
    endLineNumber: number
    endColumn: number
  }

  export interface CompletionItemProvider {
    provideCompletionItems(
      model: MonacoEditor.ITextModel,
      position: MonacoEditor.Position,
      context: CompletionContext,
      token: MonacoCancellationToken
    ): CompletionList | null | undefined | Promise<CompletionList | null | undefined>
    resolveCompletionItem?(item: CompletionItem, token: MonacoCancellationToken): CompletionItem | null | undefined | Promise<CompletionItem | null | undefined>
    triggerCharacters?: string[]
  }

  export interface CompletionContext {
    triggerKind: number
    triggerCharacter?: string
  }

  export interface CompletionList {
    suggestions: CompletionItem[]
    incomplete?: boolean
  }

  export interface CompletionItem {
    label: string
    kind: number
    insertText: string
    detail?: string
    documentation?: string | MonacoEditor.IMarkdownString
    sortText?: string
    filterText?: string
    range?: MonacoEditor.IRange
  }

  export interface InlineCompletionsProvider {
    provideInlineCompletions(
      model: MonacoEditor.ITextModel,
      position: MonacoEditor.Position,
      context: InlineCompletionContext,
      token: MonacoCancellationToken
    ): InlineCompletions | null | undefined | Promise<InlineCompletions | null | undefined>
  }

  export interface InlineCompletionContext {
    triggerKind: number
  }

  export interface InlineCompletions {
    items: InlineCompletionItem[]
  }

  export interface InlineCompletionItem {
    insertText: string
    range?: MonacoEditor.IRange
  }

  export interface HoverProvider {
    provideHover(
      model: MonacoEditor.ITextModel,
      position: MonacoEditor.Position,
      token: MonacoCancellationToken
    ): Hover | null | undefined | Promise<Hover | null | undefined>
  }

  export interface Hover {
    contents: MonacoEditor.IMarkdownString[]
    range?: MonacoEditor.IRange
  }
}

export interface MonacoCancellationToken {
  isCancellationRequested: boolean
  onCancellationRequested(listener: (e: unknown) => void): MonacoEditor.IDisposable
}

export type MonacoEditorInstance = MonacoEditor.IStandaloneCodeEditor

export type MonacoNamespace = Record<string, unknown>

export interface MonacoDecoration {
  range: MonacoEditor.IRange
  options: MonacoEditor.IModelDecorationOptions
}

export interface CollaboratorCursorDecoration {
  userId: string
  userName: string
  color: string
  cursor: { line: number; col: number }
  selection?: { startLine: number; startCol: number; endLine: number; endCol: number }
}

export type CursorPositionEvent = MonacoEditor.ICursorPositionChangedEvent
export type CursorSelectionEvent = MonacoEditor.ICursorSelectionChangedEvent

export interface EditorOptions {
  minimap?: { enabled: boolean }
  automaticLayout?: boolean
  fontSize?: number
  fontFamily?: string
  theme?: string
  wordWrap?: 'on' | 'off' | 'wordWrapColumn'
  lineNumbers?: 'on' | 'off' | 'relative' | 'interval'
  scrollBeyondLastLine?: boolean
  renderWhitespace?: 'none' | 'boundary' | 'selection' | 'trailing'
  formatOnPaste?: boolean
  formatOnType?: boolean
}

export type CodeActionProvider = MonacoLanguages.CodeActionProvider
export type CompletionItemProvider = MonacoLanguages.CompletionItemProvider
export type InlineCompletionProvider = MonacoLanguages.InlineCompletionsProvider
export type HoverProvider = MonacoLanguages.HoverProvider
