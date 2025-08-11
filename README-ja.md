# remark-remove-human

markdown はもはや AI のためのものです。

しかしながら、markdown の中に人間が読むためのコンテンツを含めたいケースはまだ存在します。

この Remark プラグインは、markdown ファイルから人間が読むためのコンテンツを削除する機能を提供することで、markdown を引き続き、人間にとっても AI にとっても有用なものにします。

<img src="./docs/images/diff.png" />

## Installation

```bash
npm install -D remark-remove-human
```

## Usage

[input.md](test/fixtures/combined-functionality/input.md):

````markdown file=test/fixtures/combined-functionality/input.md
# Technical Document

## Introduction

This is the introduction.

```human
Note for reviewers: Check grammar
```

## Implementation

Here's the implementation:

```javascript
function main() {
  console.log('Hello');
}
```

## (human) Review Notes

This section is for human reviewers only.

### Review Checklist

- Check code quality
- Verify tests

```human
Additional reviewer instructions
```

## Conclusion

Final thoughts.
````

[expected.md](test/fixtures/combined-functionality/expected.md):

````markdown file=test/fixtures/combined-functionality/expected.md
# Technical Document

## Introduction

This is the introduction.

## Implementation

Here's the implementation:

```javascript
function main() {
  console.log('Hello');
}
```

## Conclusion

Final thoughts.
````

上記の変換は以下のコードで実行できます：

```javascript
import { remark } from 'remark';
import remarkRemoveHuman from 'remark-remove-human';

const input = await readFile(inputPath, 'utf-8');

const result = await remark()
  .use(remarkRemoveHuman)
  .process(input);

console.log(result.toString());
```

## API

### `remarkRemoveHuman() (default)`

Removes code blocks with language identifier `human` and headings
prefixed with `(human)` along with all their subsections.

###### Parameters

There are no parameters.

###### Returns

Transform (`(tree: Root) => void`).

## File extensions

このプラグインを適用すべきかどうかを判断するために拡張子を使う場合、以下の拡張子の使用を推奨します：

- `.mdh`
  - Markdown for human
- `.mdxh`
  - MDX for human

## License

MIT
