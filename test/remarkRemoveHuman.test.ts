import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { remark } from 'remark';
import remarkRemoveHuman from '../src/index.ts';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const fixturesDir = join(__dirname, 'fixtures');

describe('remarkRemoveHuman', async () => {
  // Read all test case directories
  const testCases = await readdir(fixturesDir);

  for (const testCase of testCases) {
    const testCaseDir = join(fixturesDir, testCase);
    
    it(testCase.replace(/-/g, ' '), async () => {
      // Read input and expected files
      const inputPath = join(testCaseDir, 'input.md');
      const expectedPath = join(testCaseDir, 'expected.md');
      
      const input = await readFile(inputPath, 'utf-8');
      const expected = await readFile(expectedPath, 'utf-8');
      
      // Process input with the plugin
      const result = await remark()
        .use(remarkRemoveHuman)
        .process(input);
      
      // Compare the result with expected output
      assert.equal(result.toString(), expected);
    });
  }
});