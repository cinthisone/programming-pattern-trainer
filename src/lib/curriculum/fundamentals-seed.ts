import type { CatalogProblem } from "@/lib/curriculum/types";
import { implementations } from "@/lib/curriculum/implementations";

type FundamentalProblem = Omit<CatalogProblem, "track">;

const variables = {
  slug: "variables",
  name: "Variables",
  category: "Fundamentals",
};

const operators = {
  slug: "operators",
  name: "Operators",
  category: "Fundamentals",
};

const controlStructures = {
  slug: "control-structures",
  name: "Control structures",
  category: "Fundamentals",
};

const loops = {
  slug: "loops",
  name: "Loops",
  category: "Fundamentals",
};

const arrays = {
  slug: "arrays",
  name: "Arrays",
  category: "Fundamentals",
};

const sets = {
  slug: "sets",
  name: "Sets",
  category: "Fundamentals",
};

const PROBLEMS: FundamentalProblem[] = [
  {
    id: "local-read-a-number",
    slug: "read-a-number",
    title: "Read a Number",
    description:
      "Store a value in a variable and print it. Nothing fancy — just naming a piece of memory.",
    difficulty: "easy",
    instructions: "Read one integer. Print that same integer.",
    constraints: "The value fits in a 32-bit signed integer.",
    exampleInput: "7",
    exampleOutput: "7",
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    concept: variables,
    sortOrder: 10,
    hints: [
      { hintLevel: 1, content: "Read the number into a variable, then print that variable." },
      { hintLevel: 2, content: "This is assignment, not a search pattern." },
      { hintLevel: 3, content: "One variable is enough. Do not loop." },
      { hintLevel: 4, content: "n = read()\nprint(n)" },
      { hintLevel: 5, content: "Open the Solution tab." },
    ],
    tests: [
      { input: "7", expectedOutput: "7", isHidden: false },
      { input: "0", expectedOutput: "0", isHidden: false },
      { input: "-4", expectedOutput: "-4", isHidden: true },
    ],
    implementations: implementations({
      python: {
        functionSignature: "read one integer; print it",
        starterCode: `import sys

n = int(sys.stdin.read().strip())

# TODO: print n
`,
        solutionCode: `import sys

n = int(sys.stdin.read().strip())
print(n)
`,
        explanation: "n holds the input. print(n) writes it back out.",
      },
      javascript: {
        functionSignature: "read one integer; print it",
        starterCode: `const fs = require("fs");
const n = Number(fs.readFileSync(0, "utf8").trim());

// TODO: print n
`,
        solutionCode: `const fs = require("fs");
const n = Number(fs.readFileSync(0, "utf8").trim());
console.log(n);
`,
        explanation: "const n stores the number. console.log prints it.",
      },
      typescript: {
        functionSignature: "read one integer; print it",
        starterCode: `import * as fs from "fs";

const n = Number(fs.readFileSync(0, "utf8").trim());

// TODO: print n
`,
        solutionCode: `import * as fs from "fs";

const n: number = Number(fs.readFileSync(0, "utf8").trim());
console.log(n);
`,
        explanation: "TypeScript adds : number. The idea is still one variable.",
      },
      c: {
        functionSignature: "int main(void)",
        starterCode: `#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);

    /* TODO: print n */
    return 0;
}
`,
        solutionCode: `#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);
    printf("%d\\n", n);
    return 0;
}
`,
        explanation: "int n is the variable. scanf writes into it; printf reads it.",
      },
      go: {
        functionSignature: "func main()",
        starterCode: `package main

import "fmt"

func main() {
	var n int
	fmt.Scan(&n)

	// TODO: print n
}
`,
        solutionCode: `package main

import "fmt"

func main() {
	var n int
	fmt.Scan(&n)
	fmt.Println(n)
}
`,
        explanation: "var n int declares the variable. fmt.Scan fills it; fmt.Println prints it.",
      },
      php: {
        functionSignature: "<?php read one integer; echo it",
        starterCode: `<?php
$n = intval(trim(fgets(STDIN)));

// TODO: print $n
`,
        solutionCode: `<?php
$n = intval(trim(fgets(STDIN)));
echo $n . PHP_EOL;
`,
        explanation: "PHP variables start with $. $n is just a named value.",
      },
    }),
  },
  {
    id: "local-add-two-numbers",
    slug: "add-two-numbers",
    title: "Add Two Numbers",
    description:
      "Use two variables and an operator. The computer will not add them until you write +.",
    difficulty: "easy",
    instructions: "Read two integers. Print their sum.",
    constraints: "Each value fits in a 32-bit signed integer. The sum does too.",
    exampleInput: "3 5",
    exampleOutput: "8",
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    concept: operators,
    sortOrder: 20,
    hints: [
      { hintLevel: 1, content: "Store each number, then add those two variables." },
      { hintLevel: 2, content: "This is arithmetic, not a list problem." },
      { hintLevel: 3, content: "sum = a + b, then print sum." },
      { hintLevel: 4, content: "a, b = read()\nprint(a + b)" },
      { hintLevel: 5, content: "Open the Solution tab." },
    ],
    tests: [
      { input: "3 5", expectedOutput: "8", isHidden: false },
      { input: "0 0", expectedOutput: "0", isHidden: false },
      { input: "-2 9", expectedOutput: "7", isHidden: true },
    ],
    implementations: implementations({
      python: {
        functionSignature: "read two integers; print a + b",
        starterCode: `import sys

a, b = map(int, sys.stdin.read().split())

# TODO: print a + b
`,
        solutionCode: `import sys

a, b = map(int, sys.stdin.read().split())
print(a + b)
`,
        explanation: "a and b are variables. + is the operator that combines them.",
      },
      javascript: {
        functionSignature: "read two integers; print a + b",
        starterCode: `const fs = require("fs");
const [a, b] = fs.readFileSync(0, "utf8").trim().split(/\\s+/).map(Number);

// TODO: print a + b
`,
        solutionCode: `const fs = require("fs");
const [a, b] = fs.readFileSync(0, "utf8").trim().split(/\\s+/).map(Number);
console.log(a + b);
`,
        explanation: "let/const hold a and b. a + b is ordinary addition.",
      },
      typescript: {
        functionSignature: "read two integers; print a + b",
        starterCode: `import * as fs from "fs";

const [a, b] = fs.readFileSync(0, "utf8").trim().split(/\\s+/).map(Number);

// TODO: print a + b
`,
        solutionCode: `import * as fs from "fs";

const parts = fs.readFileSync(0, "utf8").trim().split(/\\s+/).map(Number);
const a = parts[0];
const b = parts[1];
console.log(a + b);
`,
        explanation: "Same addition as JavaScript. Types do not change the operator.",
      },
      c: {
        functionSignature: "int main(void)",
        starterCode: `#include <stdio.h>

int main(void) {
    int a, b;
    scanf("%d %d", &a, &b);

    /* TODO: print a + b */
    return 0;
}
`,
        solutionCode: `#include <stdio.h>

int main(void) {
    int a, b;
    scanf("%d %d", &a, &b);
    printf("%d\\n", a + b);
    return 0;
}
`,
        explanation: "int a, b; then a + b. C makes the types explicit.",
      },
      go: {
        functionSignature: "func main()",
        starterCode: `package main

import "fmt"

func main() {
	var a, b int
	fmt.Scan(&a, &b)

	// TODO: print a + b
}
`,
        solutionCode: `package main

import "fmt"

func main() {
	var a, b int
	fmt.Scan(&a, &b)
	fmt.Println(a + b)
}
`,
        explanation: "Two ints and +. Go’s + is the same idea as Python’s.",
      },
      php: {
        functionSignature: "<?php read two integers; echo sum",
        starterCode: `<?php
[$a, $b] = array_map('intval', preg_split('/\\s+/', trim(stream_get_contents(STDIN))));

// TODO: print $a + $b
`,
        solutionCode: `<?php
[$a, $b] = array_map('intval', preg_split('/\\s+/', trim(stream_get_contents(STDIN))));
echo ($a + $b) . PHP_EOL;
`,
        explanation: "$a + $b. The dollar sign is PHP syntax, not a different algorithm.",
      },
    }),
  },
  {
    id: "local-even-or-odd",
    slug: "even-or-odd",
    title: "Even or Odd",
    description:
      "Make a choice. if / else is the basic control structure for branching.",
    difficulty: "easy",
    instructions: 'Read one integer. Print "even" if it is divisible by 2, otherwise print "odd".',
    constraints: "The value fits in a 32-bit signed integer.",
    exampleInput: "4",
    exampleOutput: "even",
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    concept: controlStructures,
    sortOrder: 30,
    hints: [
      { hintLevel: 1, content: "Remainder after dividing by 2 tells you even vs odd." },
      { hintLevel: 2, content: "This is a conditional, not a loop." },
      { hintLevel: 3, content: "if n % 2 == 0 then even, else odd." },
      { hintLevel: 4, content: "if n % 2 == 0:\n    print even\nelse:\n    print odd" },
      { hintLevel: 5, content: "Open the Solution tab." },
    ],
    tests: [
      { input: "4", expectedOutput: "even", isHidden: false },
      { input: "7", expectedOutput: "odd", isHidden: false },
      { input: "0", expectedOutput: "even", isHidden: true },
    ],
    implementations: implementations({
      python: {
        functionSignature: 'read n; print "even" or "odd"',
        starterCode: `import sys

n = int(sys.stdin.read().strip())

# TODO: print even or odd
`,
        solutionCode: `import sys

n = int(sys.stdin.read().strip())
if n % 2 == 0:
    print("even")
else:
    print("odd")
`,
        explanation: "if / else chooses a path. % is remainder.",
      },
      javascript: {
        functionSignature: 'read n; print "even" or "odd"',
        starterCode: `const fs = require("fs");
const n = Number(fs.readFileSync(0, "utf8").trim());

// TODO: print even or odd
`,
        solutionCode: `const fs = require("fs");
const n = Number(fs.readFileSync(0, "utf8").trim());
if (n % 2 === 0) {
  console.log("even");
} else {
  console.log("odd");
}
`,
        explanation: "if / else with === 0. Same branch as Python, different punctuation.",
      },
      typescript: {
        functionSignature: 'read n; print "even" or "odd"',
        starterCode: `import * as fs from "fs";

const n = Number(fs.readFileSync(0, "utf8").trim());

// TODO: print even or odd
`,
        solutionCode: `import * as fs from "fs";

const n: number = Number(fs.readFileSync(0, "utf8").trim());
if (n % 2 === 0) {
  console.log("even");
} else {
  console.log("odd");
}
`,
        explanation: "The condition is still n % 2. Types do not replace if.",
      },
      c: {
        functionSignature: "int main(void)",
        starterCode: `#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);

    /* TODO: print even or odd */
    return 0;
}
`,
        solutionCode: `#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);
    if (n % 2 == 0) {
        printf("even\\n");
    } else {
        printf("odd\\n");
    }
    return 0;
}
`,
        explanation: "C’s if looks like JavaScript. == compares; % is remainder.",
      },
      go: {
        functionSignature: "func main()",
        starterCode: `package main

import "fmt"

func main() {
	var n int
	fmt.Scan(&n)

	// TODO: print even or odd
}
`,
        solutionCode: `package main

import "fmt"

func main() {
	var n int
	fmt.Scan(&n)
	if n%2 == 0 {
		fmt.Println("even")
	} else {
		fmt.Println("odd")
	}
}
`,
        explanation: "Go if has no parentheses. The boolean test is the same.",
      },
      php: {
        functionSignature: '<?php print "even" or "odd"',
        starterCode: `<?php
$n = intval(trim(fgets(STDIN)));

// TODO: print even or odd
`,
        solutionCode: `<?php
$n = intval(trim(fgets(STDIN)));
if ($n % 2 === 0) {
    echo "even" . PHP_EOL;
} else {
    echo "odd" . PHP_EOL;
}
`,
        explanation: "if / else in PHP. === 0 checks the remainder.",
      },
    }),
  },
  {
    id: "local-count-to-n",
    slug: "count-to-n",
    title: "Count to N",
    description:
      "Repeat work with a loop. The same print happens n times, with a changing counter.",
    difficulty: "easy",
    instructions: "Read n. Print the integers 1 through n, separated by spaces.",
    constraints: "1 <= n <= 1000.",
    exampleInput: "5",
    exampleOutput: "1 2 3 4 5",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    concept: loops,
    sortOrder: 40,
    hints: [
      { hintLevel: 1, content: "You need to emit more than one number. That means a loop." },
      { hintLevel: 2, content: "Count with a variable that goes from 1 to n." },
      { hintLevel: 3, content: "for i from 1 to n: print i (space-separated)." },
      { hintLevel: 4, content: "for i in 1..n:\n    emit i" },
      { hintLevel: 5, content: "Open the Solution tab." },
    ],
    tests: [
      { input: "5", expectedOutput: "1 2 3 4 5", isHidden: false },
      { input: "1", expectedOutput: "1", isHidden: false },
      { input: "3", expectedOutput: "1 2 3", isHidden: true },
    ],
    implementations: implementations({
      python: {
        functionSignature: "read n; print 1..n",
        starterCode: `import sys

n = int(sys.stdin.read().strip())

# TODO: print 1 through n
`,
        solutionCode: `import sys

n = int(sys.stdin.read().strip())
parts = []
for i in range(1, n + 1):
    parts.append(str(i))
print(" ".join(parts))
`,
        explanation: "for i in range(1, n + 1) is a counted loop. i is the changing variable.",
      },
      javascript: {
        functionSignature: "read n; print 1..n",
        starterCode: `const fs = require("fs");
const n = Number(fs.readFileSync(0, "utf8").trim());

// TODO: print 1 through n
`,
        solutionCode: `const fs = require("fs");
const n = Number(fs.readFileSync(0, "utf8").trim());
const parts = [];
for (let i = 1; i <= n; i++) {
  parts.push(String(i));
}
console.log(parts.join(" "));
`,
        explanation: "for (let i = 1; i <= n; i++) is the classic counted loop.",
      },
      typescript: {
        functionSignature: "read n; print 1..n",
        starterCode: `import * as fs from "fs";

const n = Number(fs.readFileSync(0, "utf8").trim());

// TODO: print 1 through n
`,
        solutionCode: `import * as fs from "fs";

const n = Number(fs.readFileSync(0, "utf8").trim());
const parts: string[] = [];
for (let i = 1; i <= n; i++) {
  parts.push(String(i));
}
console.log(parts.join(" "));
`,
        explanation: "Same C-style for loop as JavaScript.",
      },
      c: {
        functionSignature: "int main(void)",
        starterCode: `#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);

    /* TODO: print 1 through n */
    return 0;
}
`,
        solutionCode: `#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);
    for (int i = 1; i <= n; i++) {
        if (i > 1) {
            printf(" ");
        }
        printf("%d", i);
    }
    printf("\\n");
    return 0;
}
`,
        explanation: "C for-loops with an index. Spaces are printed between numbers.",
      },
      go: {
        functionSignature: "func main()",
        starterCode: `package main

import "fmt"

func main() {
	var n int
	fmt.Scan(&n)

	// TODO: print 1 through n
}
`,
        solutionCode: `package main

import "fmt"

func main() {
	var n int
	fmt.Scan(&n)
	for i := 1; i <= n; i++ {
		if i > 1 {
			fmt.Print(" ")
		}
		fmt.Print(i)
	}
	fmt.Println()
}
`,
        explanation: "Go’s for is the only loop keyword. Here it counts 1..n.",
      },
      php: {
        functionSignature: "<?php print 1..n",
        starterCode: `<?php
$n = intval(trim(fgets(STDIN)));

// TODO: print 1 through n
`,
        solutionCode: `<?php
$n = intval(trim(fgets(STDIN)));
$parts = [];
for ($i = 1; $i <= $n; $i++) {
    $parts[] = (string) $i;
}
echo implode(' ', $parts) . PHP_EOL;
`,
        explanation: "for ($i = 1; $i <= $n; $i++) matches C and JavaScript.",
      },
    }),
  },
  {
    id: "local-sum-of-a-list",
    slug: "sum-of-a-list",
    title: "Sum of a List",
    description:
      "Walk an array with a loop and add the values. This is a list, not a pattern name.",
    difficulty: "easy",
    instructions:
      "The first integer is n. The next n integers are the list. Print the sum of the list.",
    constraints: "1 <= n <= 1000. The sum fits in a 32-bit signed integer.",
    exampleInput: "4\n1 2 3 4",
    exampleOutput: "10",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    concept: arrays,
    sortOrder: 50,
    hints: [
      { hintLevel: 1, content: "Hold the numbers in a list, then add them one by one." },
      { hintLevel: 2, content: "This is array traversal plus a running sum — still basics." },
      { hintLevel: 3, content: "total = 0; for each value: total += value." },
      { hintLevel: 4, content: "total = 0\nfor x in nums:\n    total += x\nprint(total)" },
      { hintLevel: 5, content: "Open the Solution tab." },
    ],
    tests: [
      { input: "4\n1 2 3 4", expectedOutput: "10", isHidden: false },
      { input: "1\n9", expectedOutput: "9", isHidden: false },
      { input: "3\n-1 0 5", expectedOutput: "4", isHidden: true },
    ],
    implementations: implementations({
      python: {
        functionSignature: "read n integers; print their sum",
        starterCode: `import sys

data = sys.stdin.read().split()
n = int(data[0])
nums = list(map(int, data[1:1 + n]))

# TODO: print the sum of nums
`,
        solutionCode: `import sys

data = sys.stdin.read().split()
n = int(data[0])
nums = list(map(int, data[1:1 + n]))

total = 0
for value in nums:
    total += value
print(total)
`,
        explanation: "nums is a list. for value in nums walks it. total adds each element.",
      },
      javascript: {
        functionSignature: "read n integers; print their sum",
        starterCode: `const fs = require("fs");
const data = fs.readFileSync(0, "utf8").trim().split(/\\s+/);
const n = Number(data[0]);
const nums = data.slice(1, 1 + n).map(Number);

// TODO: print the sum of nums
`,
        solutionCode: `const fs = require("fs");
const data = fs.readFileSync(0, "utf8").trim().split(/\\s+/);
const n = Number(data[0]);
const nums = data.slice(1, 1 + n).map(Number);

let total = 0;
for (const value of nums) {
  total += value;
}
console.log(total);
`,
        explanation: "An array plus for...of. total starts at 0.",
      },
      typescript: {
        functionSignature: "read n integers; print their sum",
        starterCode: `import * as fs from "fs";

const data = fs.readFileSync(0, "utf8").trim().split(/\\s+/);
const n = Number(data[0]);
const nums = data.slice(1, 1 + n).map(Number);

// TODO: print the sum of nums
`,
        solutionCode: `import * as fs from "fs";

const data = fs.readFileSync(0, "utf8").trim().split(/\\s+/);
const n = Number(data[0]);
const nums: number[] = data.slice(1, 1 + n).map(Number);

let total = 0;
for (const value of nums) {
  total += value;
}
console.log(total);
`,
        explanation: "number[] is still an array you loop over.",
      },
      c: {
        functionSignature: "int main(void)",
        starterCode: `#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);

    /* TODO: read n integers and print their sum */
    return 0;
}
`,
        solutionCode: `#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);
    int total = 0;
    for (int i = 0; i < n; i++) {
        int value;
        scanf("%d", &value);
        total += value;
    }
    printf("%d\\n", total);
    return 0;
}
`,
        explanation: "C often reads array elements one at a time in a for loop.",
      },
      go: {
        functionSignature: "func main()",
        starterCode: `package main

import "fmt"

func main() {
	var n int
	fmt.Scan(&n)

	// TODO: read n integers and print their sum
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
	}
	fmt.Println(total)
}
`,
        explanation: "A slice is optional here. Scanning n times is enough.",
      },
      php: {
        functionSignature: "<?php sum n integers",
        starterCode: `<?php
$tokens = preg_split('/\\s+/', trim(stream_get_contents(STDIN)));
$n = intval($tokens[0]);

// TODO: print the sum
`,
        solutionCode: `<?php
$tokens = preg_split('/\\s+/', trim(stream_get_contents(STDIN)));
$n = intval($tokens[0]);
$total = 0;
for ($i = 0; $i < $n; $i++) {
    $total += intval($tokens[$i + 1]);
}
echo $total . PHP_EOL;
`,
        explanation: "PHP arrays are 0-based. Values start at index 1 after n.",
      },
    }),
  },
  {
    id: "local-first-and-last",
    slug: "first-and-last",
    title: "First and Last",
    description:
      "Index into an array. Position 0 is the first element; position n - 1 is the last.",
    difficulty: "easy",
    instructions:
      "The first integer is n. The next n integers are the list. Print the first value and the last value, separated by a space.",
    constraints: "1 <= n <= 1000.",
    exampleInput: "4\n10 20 30 40",
    exampleOutput: "10 40",
    timeComplexity: "O(1) after the list is read",
    spaceComplexity: "O(n)",
    concept: arrays,
    sortOrder: 60,
    hints: [
      { hintLevel: 1, content: "You only need two positions: the start and the end." },
      { hintLevel: 2, content: "Arrays are indexed from 0 in these languages." },
      { hintLevel: 3, content: "Print nums[0] and nums[n-1]." },
      { hintLevel: 4, content: "print(nums[0], nums[n-1])" },
      { hintLevel: 5, content: "Open the Solution tab." },
    ],
    tests: [
      { input: "4\n10 20 30 40", expectedOutput: "10 40", isHidden: false },
      { input: "1\n5", expectedOutput: "5 5", isHidden: false },
      { input: "3\n-1 8 2", expectedOutput: "-1 2", isHidden: true },
    ],
    implementations: implementations({
      python: {
        functionSignature: "read n integers; print first and last",
        starterCode: `import sys

data = sys.stdin.read().split()
n = int(data[0])
nums = list(map(int, data[1:1 + n]))

# TODO: print the first and last values
`,
        solutionCode: `import sys

data = sys.stdin.read().split()
n = int(data[0])
nums = list(map(int, data[1:1 + n]))
print(nums[0], nums[n - 1])
`,
        explanation: "nums[0] is the first item. nums[-1] also works in Python; n - 1 is the portable idea.",
      },
      javascript: {
        functionSignature: "read n integers; print first and last",
        starterCode: `const fs = require("fs");
const data = fs.readFileSync(0, "utf8").trim().split(/\\s+/);
const n = Number(data[0]);
const nums = data.slice(1, 1 + n).map(Number);

// TODO: print the first and last values
`,
        solutionCode: `const fs = require("fs");
const data = fs.readFileSync(0, "utf8").trim().split(/\\s+/);
const n = Number(data[0]);
const nums = data.slice(1, 1 + n).map(Number);
console.log(nums[0] + " " + nums[n - 1]);
`,
        explanation: "nums[0] and nums[n - 1]. JavaScript arrays are 0-indexed.",
      },
      typescript: {
        functionSignature: "read n integers; print first and last",
        starterCode: `import * as fs from "fs";

const data = fs.readFileSync(0, "utf8").trim().split(/\\s+/);
const n = Number(data[0]);
const nums = data.slice(1, 1 + n).map(Number);

// TODO: print the first and last values
`,
        solutionCode: `import * as fs from "fs";

const data = fs.readFileSync(0, "utf8").trim().split(/\\s+/);
const n = Number(data[0]);
const nums: number[] = data.slice(1, 1 + n).map(Number);
console.log(nums[0] + " " + nums[n - 1]);
`,
        explanation: "Indexing does not change because the type is number[].",
      },
      c: {
        functionSignature: "int main(void)",
        starterCode: `#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);

    /* TODO: read n integers; print first and last */
    return 0;
}
`,
        solutionCode: `#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);
    int nums[1000];
    for (int i = 0; i < n; i++) {
        scanf("%d", &nums[i]);
    }
    printf("%d %d\\n", nums[0], nums[n - 1]);
    return 0;
}
`,
        explanation: "A fixed array nums[1000], then nums[0] and nums[n-1].",
      },
      go: {
        functionSignature: "func main()",
        starterCode: `package main

import "fmt"

func main() {
	var n int
	fmt.Scan(&n)

	// TODO: read n integers; print first and last
}
`,
        solutionCode: `package main

import "fmt"

func main() {
	var n int
	fmt.Scan(&n)
	nums := make([]int, n)
	for i := 0; i < n; i++ {
		fmt.Scan(&nums[i])
	}
	fmt.Println(nums[0], nums[n-1])
}
`,
        explanation: "A Go slice, indexed the same way: 0 and n-1.",
      },
      php: {
        functionSignature: "<?php print first and last",
        starterCode: `<?php
$tokens = preg_split('/\\s+/', trim(stream_get_contents(STDIN)));
$n = intval($tokens[0]);

// TODO: print first and last
`,
        solutionCode: `<?php
$tokens = preg_split('/\\s+/', trim(stream_get_contents(STDIN)));
$n = intval($tokens[0]);
$first = intval($tokens[1]);
$last = intval($tokens[$n]);
echo $first . ' ' . $last . PHP_EOL;
`,
        explanation: "After n, the first value is index 1 and the last is index n.",
      },
    }),
  },
  {
    id: "local-count-uniques",
    slug: "count-uniques",
    title: "Count Uniques",
    description:
      "A set keeps each value once. Use it to count how many distinct numbers appeared.",
    difficulty: "easy",
    instructions:
      "The first integer is n. The next n integers are the list. Print how many distinct values are in the list.",
    constraints: "1 <= n <= 100. 0 <= each value <= 100.",
    exampleInput: "6\n1 2 2 3 1 3",
    exampleOutput: "3",
    timeComplexity: "O(n)",
    spaceComplexity: "O(k) where k is the number of distinct values",
    concept: sets,
    sortOrder: 70,
    hints: [
      { hintLevel: 1, content: "Duplicates should not count twice." },
      { hintLevel: 2, content: "A set (or a seen-flags array) stores membership." },
      { hintLevel: 3, content: "Insert each value into a set, then print the set size." },
      { hintLevel: 4, content: "seen = set()\nfor x in nums:\n    seen.add(x)\nprint(len(seen))" },
      { hintLevel: 5, content: "Open the Solution tab. C uses a boolean array instead of a set type." },
    ],
    tests: [
      { input: "6\n1 2 2 3 1 3", expectedOutput: "3", isHidden: false },
      { input: "1\n0", expectedOutput: "1", isHidden: false },
      { input: "4\n5 5 5 5", expectedOutput: "1", isHidden: true },
    ],
    implementations: implementations({
      python: {
        functionSignature: "read n integers; print distinct count",
        starterCode: `import sys

data = sys.stdin.read().split()
n = int(data[0])
nums = list(map(int, data[1:1 + n]))

# TODO: print how many unique values
`,
        solutionCode: `import sys

data = sys.stdin.read().split()
n = int(data[0])
nums = list(map(int, data[1:1 + n]))
seen = set(nums)
print(len(seen))
`,
        explanation: "set(nums) drops duplicates. len(seen) is the unique count.",
      },
      javascript: {
        functionSignature: "read n integers; print distinct count",
        starterCode: `const fs = require("fs");
const data = fs.readFileSync(0, "utf8").trim().split(/\\s+/);
const n = Number(data[0]);
const nums = data.slice(1, 1 + n).map(Number);

// TODO: print how many unique values
`,
        solutionCode: `const fs = require("fs");
const data = fs.readFileSync(0, "utf8").trim().split(/\\s+/);
const n = Number(data[0]);
const nums = data.slice(1, 1 + n).map(Number);
const seen = new Set(nums);
console.log(seen.size);
`,
        explanation: "new Set(nums) stores each value once. .size is the count.",
      },
      typescript: {
        functionSignature: "read n integers; print distinct count",
        starterCode: `import * as fs from "fs";

const data = fs.readFileSync(0, "utf8").trim().split(/\\s+/);
const n = Number(data[0]);
const nums = data.slice(1, 1 + n).map(Number);

// TODO: print how many unique values
`,
        solutionCode: `import * as fs from "fs";

const data = fs.readFileSync(0, "utf8").trim().split(/\\s+/);
const n = Number(data[0]);
const nums: number[] = data.slice(1, 1 + n).map(Number);
const seen = new Set<number>(nums);
console.log(seen.size);
`,
        explanation: "Set<number> is JavaScript’s Set with a type parameter.",
      },
      c: {
        functionSignature: "int main(void)",
        starterCode: `#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);

    /* TODO: count unique values (0..100) */
    return 0;
}
`,
        solutionCode: `#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);
    int seen[101] = {0};
    int unique = 0;
    for (int i = 0; i < n; i++) {
        int value;
        scanf("%d", &value);
        if (!seen[value]) {
            seen[value] = 1;
            unique++;
        }
    }
    printf("%d\\n", unique);
    return 0;
}
`,
        explanation: "C has no set type here. seen[value] is a membership flag for 0..100.",
      },
      go: {
        functionSignature: "func main()",
        starterCode: `package main

import "fmt"

func main() {
	var n int
	fmt.Scan(&n)

	// TODO: count unique values
}
`,
        solutionCode: `package main

import "fmt"

func main() {
	var n int
	fmt.Scan(&n)
	seen := map[int]bool{}
	unique := 0
	for i := 0; i < n; i++ {
		var value int
		fmt.Scan(&value)
		if !seen[value] {
			seen[value] = true
			unique++
		}
	}
	fmt.Println(unique)
}
`,
        explanation: "Go uses map[int]bool as a set. The key existing means “already seen”.",
      },
      php: {
        functionSignature: "<?php count unique values",
        starterCode: `<?php
$tokens = preg_split('/\\s+/', trim(stream_get_contents(STDIN)));
$n = intval($tokens[0]);

// TODO: print how many unique values
`,
        solutionCode: `<?php
$tokens = preg_split('/\\s+/', trim(stream_get_contents(STDIN)));
$n = intval($tokens[0]);
$seen = [];
for ($i = 0; $i < $n; $i++) {
    $value = intval($tokens[$i + 1]);
    $seen[$value] = true;
}
echo count($seen) . PHP_EOL;
`,
        explanation: "PHP associative arrays act like sets when the key is the value.",
      },
    }),
  },
];

export const FUNDAMENTAL_PROBLEMS: CatalogProblem[] = PROBLEMS.map((problem) => ({
  ...problem,
  track: "basics",
}));
