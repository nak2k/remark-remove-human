import type { Root, Heading, Code } from 'mdast';
import { toString } from 'mdast-util-to-string';
import { visit, SKIP } from 'unist-util-visit';

/**
 * Removes code blocks with language identifier `human` and headings
 * prefixed with `(human)` along with all their subsections.
 *
 * @returns Transform.
 */
export default function remarkRemoveHuman() {
  return (tree: Root) => {
    const nodesToRemove = new Set<any>();

    // Remove code blocks with language identifier 'human'
    visit(tree, 'code', (node: Code, index, parent) => {
      if (node.lang === 'human') {
        nodesToRemove.add(node);
      }
    });

    // Find headings with (human) prefix and mark them and their subsections for removal
    visit(tree, 'heading', (node: Heading, index, parent) => {
      const headingText = toString(node);
      if (!headingText.startsWith('(human)')) {
        return;
      }

      // Mark this heading for removal
      nodesToRemove.add(node);

      // Find and mark all subsections
      if (parent && index !== null && index !== undefined) {
        const currentDepth = node.depth;
        let nextIndex = index + 1;

        // Mark all following nodes until we hit a heading of equal or lesser depth
        while (nextIndex < parent.children.length) {
          const nextNode = parent.children[nextIndex];

          if (nextNode.type === 'heading' && nextNode.depth <= currentDepth) {
            // Stop when we reach a heading of equal or lesser depth
            break;
          }

          // Mark this node for removal (it's part of the human section)
          nodesToRemove.add(nextNode);
          nextIndex++;
        }
      }

      return SKIP; // Skip visiting children of this heading
    });

    // Remove marked nodes
    visit(tree, (node, index, parent) => {
      if (parent && index !== null && index !== undefined && nodesToRemove.has(node)) {
        parent.children.splice(index, 1);
        return [SKIP, index]; // Skip this node and continue from the same index
      }
    });
  };
};
