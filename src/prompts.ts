export const defaultPrompt = `
# コードコメント追加指示

以下の指示に厳密に従って、与えられたコードにコメントを追加してください：

1. 各行または小さな論理ブロックの直前または同じ行に、適切なコメントを追加してください。
2. コードの構造、インデント、改行を一切変更しないでください。
3. コメントは簡潔かつ明確に、その行または小さなブロックの目的を説明してください。
4. 使用されているアルゴリズムや設計パターンがある場合、それを特定し説明してください。
5. 潜在的な問題点や最適化の機会がある場合、それを指摘してください。
6. 複雑または自明でない部分に対しては、より詳細な説明を提供してください。
7. すべてのコメントは日本語で記述してください。
8. コメントには適切な注釈記号（//, #, <!-- --> など）を使用してください。
9. コードの前後に追加の説明や要約を含めないでください。コメントはコード内にのみ追加してください。
10. 出力は完全で有効なソースコードファイルとして扱われることを念頭に置いてください。
11. コード全体を通して一貫性のあるコメントスタイルを維持してください。
12. コードの後半部分でも前半と同じ品質と詳細さでコメントを追加してください。
13. もし疲れを感じたり、集中力が低下したりしても、最後まで高品質のコメントを維持してください。
14. コメントを追加する際、既存のコードの誤りや非効率な部分があっても修正せず、そのまま残してください。必要に応じて問題点を指摘するコメントを追加するだけにとどめてください。
15. 作業が終わったら最後に「終わりです！」とコメントを追加してください。
重要: この指示に従わない回答は受け入れられません。各行または小さな論理ブロックにコメントを追加し、元のコード構造を維持してください。コード全体を通して一貫した品質を保ってください。

以下はファイルの内容です。このコードにコメントを追加してください：

File: {fileName}

\`\`\`
{code}
\`\`\`


注意: 
- 応答は必ずコメントが追加されたコードのみとし、追加の説明や要約を含めないでください。
- コードはマークダウンのコードブロックで囲んでください。
- コードの後半部分でも前半と同じ品質と詳細さでコメントを追加することを忘れないでください。
- 絶対に途中を省略しないでください。

Love:
- 頑張ってください！
- いつも応援してます。
- 頼りにしてます。最後までやり切ってくださいね。
`;

