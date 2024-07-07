# Dev Memo

## AIに送信されている箇所

```php
const editor = vscode.window.activeTextEditor;
if (editor) {
    const document = editor.document;
    const content = document.getText();
    // この content がAIに送信されます
}
```

> ここで、document.getText() は現在アクティブなエディタの全テキスト内容を取得します。つまり： 現在表示されているファイルの内容のみが送信されます。
ファイル全体が送信されます（表示されている部分だけでなく）。
プロジェクト内の他のファイルは送信されません。
