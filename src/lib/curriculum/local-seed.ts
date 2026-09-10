import { FUNDAMENTAL_PROBLEMS } from "@/lib/curriculum/fundamentals-seed";
import type { CatalogProblem, ProblemImplementation } from "@/lib/curriculum/types";

const python: ProblemImplementation = {
  languageSlug: "python",
  functionSignature: "read n integers from stdin; print running totals",
  starterCode: `import sys

data = sys.stdin.read().split()
n = int(data[0])
nums = list(map(int, data[1:1 + n]))

# TODO: accumulate a running total and print the prefix sums
print()
`,
  solutionCode: `import sys

data = sys.stdin.read().split()
n = int(data[0])
nums = list(map(int, data[1:1 + n]))

total = 0
parts = []
for value in nums:
    total += value
    parts.append(str(total))

print(" ".join(parts))
`,
  explanation:
    "Keep one accumulator. Each step adds the next value and records the new total.",
};

const javascript: ProblemImplementation = {
  languageSlug: "javascript",
  functionSignature: "read n integers from stdin; print running totals",
  starterCode: `const fs = require("fs");
const data = fs.readFileSync(0, "utf8").trim().split(/\\s+/);
const n = Number(data[0]);
const nums = data.slice(1, 1 + n).map(Number);

// TODO: accumulate a running total and print the prefix sums
console.log();
`,
  solutionCode: `const fs = require("fs");
const data = fs.readFileSync(0, "utf8").trim().split(/\\s+/);
const n = Number(data[0]);
const nums = data.slice(1, 1 + n).map(Number);

let total = 0;
const parts = [];
for (const value of nums) {
  total += value;
  parts.push(String(total));
}

process.stdout.write(parts.join(" ") + "\\n");
`,
  explanation:
    "Same accumulator pattern as Python. for...of walks the array; total is a number.",
};

const typescript: ProblemImplementation = {
  languageSlug: "typescript",
  functionSignature: "read n integers from stdin; print running totals",
  starterCode: `import * as fs from "fs";

const data = fs.readFileSync(0, "utf8").trim().split(/\\s+/);
const n = Number(data[0]);
const nums = data.slice(1, 1 + n).map(Number);

// TODO: accumulate a running total and print the prefix sums
console.log();
`,
  solutionCode: `import * as fs from "fs";

const data = fs.readFileSync(0, "utf8").trim().split(/\\s+/);
const n = Number(data[0]);
const nums: number[] = data.slice(1, 1 + n).map(Number);

let total = 0;
const parts: string[] = [];
for (const value of nums) {
  total += value;
  parts.push(String(total));
}

process.stdout.write(parts.join(" ") + "\\n");
`,
  explanation:
    "Identical algorithm to JavaScript with explicit number[] / string[] annotations.",
};

const c: ProblemImplementation = {
  languageSlug: "c",
  functionSignature: "int main(void)",
  starterCode: `#include <stdio.h>

int main(void) {
    int n;
    if (scanf("%d", &n) != 1) {
        return 0;
    }

    /* TODO: accumulate a running total and print the prefix sums */
    return 0;
}
`,
  solutionCode: `#include <stdio.h>

int main(void) {
    int n;
    if (scanf("%d", &n) != 1) {
        return 0;
    }

    int total = 0;
    for (int i = 0; i < n; i++) {
        int value;
        if (scanf("%d", &value) != 1) {
            return 0;
        }
        total += value;
        if (i > 0) {
            printf(" ");
        }
        printf("%d", total);
    }
    printf("\\n");
    return 0;
}
`,
  explanation:
    "Same running total, with an explicit loop index and scanf. Length is passed as n.",
};

const go: ProblemImplementation = {
  languageSlug: "go",
  functionSignature: "func main()",
  starterCode: `package main

import "fmt"

func main() {
	var n int
	fmt.Scan(&n)

	// TODO: accumulate a running total and print the prefix sums
}
`,
  solutionCode: `package main

import "fmt"

func main() {
	var n int
	fmt.Scan(&n)

	total := 0
	for i := 0; i < n; i++ {
		var value int
		fmt.Scan(&value)
		total += value
		if i > 0 {
			fmt.Print(" ")
		}
		fmt.Print(total)
	}
	fmt.Println()
}
`,
  explanation:
    "Go uses total := 0 and an indexed for loop. The algorithm is still one accumulator.",
};

const php: ProblemImplementation = {
  languageSlug: "php",
  functionSignature: "<?php read stdin; echo running totals",
  starterCode: `<?php
$tokens = preg_split('/\\s+/', trim(stream_get_contents(STDIN)));
$n = intval($tokens[0]);

// TODO: accumulate a running total and print the prefix sums
`,
  solutionCode: `<?php
$tokens = preg_split('/\\s+/', trim(stream_get_contents(STDIN)));
$n = intval($tokens[0]);

$total = 0;
$parts = [];
for ($i = 0; $i < $n; $i++) {
    $total += intval($tokens[$i + 1]);
    $parts[] = (string) $total;
}

echo implode(' ', $parts) . PHP_EOL;
`,
  explanation:
    "PHP still uses one running $total. Arrays are 0-indexed; values start at $tokens[1].",
};

export const LOCAL_PROBLEMS: CatalogProblem[] = [
  ...FUNDAMENTAL_PROBLEMS,
  {
    id: "local-running-total",
    slug: "running-total",
    title: "Running Total",
    description:
      "Compute prefix sums. This is the accumulator pattern: one variable that grows as you walk a sequence.",
    difficulty: "easy",
    instructions:
      "The first integer is n. The next n integers are the array. Print the running total after each element, separated by spaces.",
    constraints: "1 <= n <= 1000. Values fit in a 32-bit signed integer after summing.",
    exampleInput: "4\n1 2 3 4",
    exampleOutput: "1 3 6 10",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n) for the output (O(1) extra besides I/O)",
    concept: {
      slug: "accumulator",
      name: "Accumulator",
      category: "Arrays",
    },
    track: "patterns",
    sortOrder: 100,
    hints: [
      {
        hintLevel: 1,
        content: "You only need to remember one number as you walk the list.",
      },
      {
        hintLevel: 2,
        content: "This is the accumulator / prefix-sum pattern.",
      },
      {
        hintLevel: 3,
        content:
          "Initialize total to 0. For each value, add it to total, then emit total.",
      },
      {
        hintLevel: 4,
        content: "total = 0\nfor x in nums:\n    total += x\n    emit total",
      },
      {
        hintLevel: 5,
        content: "Open the Reference tab for the current language.",
      },
    ],
    tests: [
      { input: "4\n1 2 3 4", expectedOutput: "1 3 6 10", isHidden: false },
      { input: "1\n9", expectedOutput: "9", isHidden: false },
      { input: "3\n-1 0 5", expectedOutput: "-1 -1 4", isHidden: true },
    ],
    implementations: [python, javascript, typescript, c, go, php],
  },
];
