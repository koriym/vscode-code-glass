# CodeGlass
CodeGlass は、コードの読みやすさと理解を向上させるために設計された Visual Studio Code 拡張機能です。AI を使用してソースコードの洞察力のあるコメントを生成し、開発者が複雑なコードベースを理解し、新しい言語を学び、新しいプロジェクトに参加しやすくします。

## 主な機能


2. **AI パワードコメント**: AI が作成したコメントを元のコードと並べて生成・表示します。

## 前提条件

- Node.js (v14 以降)
- npm
- Visual Studio Code
- [Ollama](https://ollama.ai/)

## 始め方

### 1. クローンとセットアップ

1. リポジトリをクローンします。

2. 依存関係をインストールします：
   ```
   npm install
   ```

### 2. AI モデルのセットアップ

1. Ollama がインストールされ、実行されていることを確認します。

2. AI モデルをプルします：

   ```
   ollama pull deepseek-coder-v2:16b
   ```

3. プロジェクトのルートに以下の内容で `Modelfile` を作成します：

```
FROM deepseek-coder-v2:16b

PARAMETER temperature 1.0
PARAMETER top_p 0.95

SYSTEM """You are a professional AI assistant that analyses source code and generates insightful comments. Your task is to provide concise and clear explanations to improve readability and understanding of the code. 
"""
```

4. CodeGlass モデルを作成します：
   ```
   ollama create codeglass -f Modelfile
   ```

### 3. 拡張機能の実行

1. VS Code でプロジェクトを開きます：
   ```
   code .
   ```

2. F5 キーを押してデバッグを開始します。拡張機能が読み込まれた新しい VS Code ウィンドウが開きます。

3. 新しいウィンドウで、コードファイルを開き、コマンドパレット（Ctrl+Shift+P または Cmd+Shift+P）から "CodeGlass: Show Code Preview" コマンドを実行します。

### 4. コードの編集

1. メインの拡張機能ロジックは `src/extension.ts` にあります。
2. AI との対話は `src/ollamaConnection.ts`, `src/aiConnection.ts` で処理されています。
3. 変更を加えた後、プロジェクトを再コンパイルします：
   ```
   npm run compile
   ```
4. VS Code でデバッグセッションを再起動（F5）して、変更をテストします。

### 5. プロンプトの編集

CodeGlass の機能をカスタマイズしたり、異なる用途に適用したりするには、プロンプトを編集することができます。

1. `prompts.ts` ファイルを開きます。
2. このファイル内のプロンプトを編集して、AI の動作や生成するコンテンツを変更します。

プロンプトを編集することで、コメント生成以外の機能も開発できます。例えば、コードの最適化提案、セキュリティチェック、ドキュメント生成など、様々な用途に CodeGlass を応用できます。

## 設定

CodeGlass では、コードコメント生成に使用する AI サービスを選択できます。この設定は VS Code の設定インターフェースを通じて行えます。

### AI サービスの変更

CodeGlass が使用する AI サービスを変更するには：

1. コマンドパレットを開きます（Windows/Linux では Ctrl+Shift+P、macOS では Cmd+Shift+P）。
2. "Preferences: Open Settings (UI)" と入力して選択します。
3. 設定タブの検索バーに "CodeGlass" と入力します。
4. `codeglass.connectionType` 設定を探します。
5. ドロップダウンメニューから "ollama" または "deepseek" を選択します。

あるいは、`settings.json` ファイルを直接編集することもできます：

1. コマンドパレットを開きます。
2. "Preferences: Open Settings (JSON)" と入力して選択します。
3. 以下の設定を追加または修正します：

```json
{
  "codeglass.connectionType": "ollama"  // または "deepseek"
}
```

変更は即時に反映されるはずですが、変更が適用されない場合は VS Code を再起動する必要があるかもしれません。

### 利用可能なオプション

- `ollama`: コードコメント生成に Ollama AI サービスを使用します。
- `deepseek`: コードコメント生成に DeepSeek AI サービスを使用します。

ニーズと好みに合わせてオプションを選択してください。

### DeepSeek の追加セットアップ

DeepSeek を AI サービスとして選択した場合、追加のセットアップが必要です：

1. DeepSeek アカウントをまだ持っていない場合は作成します。
2. DeepSeek アカウントのダッシュボードから API キーを取得します。
3. `CODEGLASS_API_KEY` という名前の環境変数を設定し、DeepSeek の API キーを値として設定します。

環境変数を設定するには：

- Windows の場合：
    1. スタートメニューを開き、"環境変数" を検索します。
    2. "システム環境変数の編集" をクリックします。
    3. システムのプロパティウィンドウで、"環境変数" をクリックします。
    4. "ユーザー変数" で "新規" をクリックし、変数名に `CODEGLASS_API_KEY`、値に API キーを入力します。

- macOS と Linux の場合：
    1. シェルの設定ファイル（例：`~/.bash_profile`, `~/.zshrc` など）を開きます。
    2. 以下の行を追加します：`export CODEGLASS_API_KEY=your_api_key_here`
    3. ファイルを保存し、ターミナルを再起動するか、`source ~/.bash_profile`（または編集したファイル）を実行します。

環境変数を設定した後、新しい API キーを認識させるために VS Code を再起動してください。

注意：API キーは機密情報です。絶対に公開しないでください。

## 現在の状況と今後の開発

- コードプレビュー機能は実装され、機能しています。
- 現在、コメント生成には codellama:7b-instruct モデルを使用しています。
- 品質についてはOllamaのものはそれほどでもないですが、これは調整の問題かもしれません。
- プロンプトの編集ができればいいと考えてます。

## トラブルシューティング

- AI モデルに問題がある場合は、Ollama が実行されており、codeglass モデルが正しく読み込まれていることを確認してください。
- 詳細なエラーメッセージについては、VS Code のデバッグコンソールを確認してください。
- DeepSeek を使用していて問題が発生した場合は、API キーが環境変数に正しく設定されていることを確認してください。
