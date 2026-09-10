import type { LanguagePrimers, PrimerSection } from "@/lib/curriculum/primer-model";

const JS_VARIABLE_SECTIONS: PrimerSection[] = [
  {
    heading: "Execution context",
    body: "When JavaScript starts a script or calls a function, it creates an execution context: a record of where the engine is and which names exist here. Each context has an environment — a map of names to values — plus a link to the outer environment. Nested functions keep that outer link after the call returns; that is a closure. var bindings live on the function (or global) environment. let and const live on the nearest block’s environment.",
  },
  {
    heading: "Scope",
    body: "Scope is the region of code that can see a name. JavaScript has global scope, function scope, and block scope. var is function-scoped: an if, for, or while does not hide it. let and const are block-scoped: each { } (and the header of a for) gets its own binding. A top-level var also becomes a property of the global object (window in a browser). A top-level let or const is global but is not attached to window.",
    example: `function demo() {
  if (true) {
    var leaked = 1;  // function-scoped
    let boxed = 2;   // block-scoped
  }
  console.log(leaked); // 1 — var ignored the if
  // console.log(boxed); // ReferenceError — let stayed in the block
}`,
  },
  {
    heading: "Hoisting",
    body: "Before any line of a scope runs, JavaScript registers every declaration in that scope. That registration is hoisting: the name is created first, the assignment stays on the line you wrote. var is hoisted and initialized to undefined immediately, so reading it above its line yields undefined, not an error. Function declarations are hoisted with their body, so you can call them above the line. let and const are also hoisted (the binding exists) but they are not initialized until their line runs.",
    example: `console.log(total); // undefined — the var exists, the 1 does not yet
var total = 1;

console.log(double(3)); // 6 — the function body was hoisted too
function double(n) {
  return n * 2;
}`,
  },
  {
    heading: "Temporal dead zone",
    body: "From the start of the block until the let or const line runs, the binding exists but is uninitialized. That gap is the temporal dead zone (TDZ). Reading or writing the name in the TDZ throws ReferenceError. var has no TDZ because it is initialized to undefined as soon as it is hoisted. The TDZ is why let and const cannot be used “early” the way var can.",
    example: `{
  // TDZ for n starts here
  // console.log(n); // ReferenceError, not undefined
  let n = 7;         // TDZ ends; n is 7
}`,
  },
  {
    heading: "Why var is not recommended for modern apps",
    body: "var still works, and you will see it in older code and interviews, so a learning tool has to teach it. Modern apps use let and const instead because var leaks out of blocks, hoists to undefined (hiding typos), allows silent redeclaration in the same function, and at top level becomes a global object property. Those behaviors caused real bugs. Learn var so you can read it; do not write it in new code.",
  },
];

export const VARIABLES: LanguagePrimers = {
  python: {
    how: "Python has no var, let, or const. A name exists as soon as you assign to it with =. You can reassign later. There is no separate “declare” step.",
    example: `n = 7          # create n and store 7
n = n + 1      # reassign: n now holds 8
a, b = 3, 5    # two names at once
print(a + b)`,
    keywords: [
      { name: "=", use: "Creates the name if it is new, or replaces the value if it already exists." },
    ],
    sections: [
      {
        heading: "Scope",
        body: "Python uses LEGB: Local, Enclosing function, Global, Built-in. If a function assigns to a name anywhere, that name is local for the whole function — even lines above the assignment.",
      },
      {
        heading: "Hoisting",
        body: "Python does not hoist names the way JavaScript does. The assignment line is both the declaration and the initialization. Reading a local before that assignment is UnboundLocalError, not None.",
      },
      {
        heading: "global and nonlocal",
        body: "Assignment makes a name local unless you opt out. global n writes the module name. nonlocal n writes an enclosing function’s name. A learning tool shows both; most of these problems only need a local.",
      },
    ],
    watch: [
      "There is no declaration keyword. Writing n = 7 is the whole story.",
      "Using n before any assignment raises NameError.",
    ],
  },
  javascript: {
    how: "JavaScript has three declaration keywords: var, let, and const. They all create a binding. What differs is which region can see the name (scope), whether the name exists before that line runs (hoisting), and whether you may assign again. Modern apps use const by default and let when the name must change. var is still part of the language — learn it so you can read older code — but it is not recommended for modern apps.",
    example: `const n = 7;
let total = 0;
total = total + n;`,
    keywords: [
      {
        name: "var",
        use: "Original keyword. Function-scoped. Hoisted and set to undefined. Can be redeclared.",
        modern: false,
        whyNotModern:
          "Leaks out of if/for, hoists to undefined, and can be redeclared silently — a common source of bugs.",
      },
      {
        name: "let",
        use: "Block-scoped. Hoisted into the TDZ until its line. You may reassign. Use for counters and totals.",
      },
      {
        name: "const",
        use: "Block-scoped. Hoisted into the TDZ. You may not rebind the name. Default when the name should stay put.",
      },
    ],
    sections: JS_VARIABLE_SECTIONS,
    watch: [
      "console.log(x); var x = 1 prints undefined. The same with let throws.",
      "var leaks out of if / for. let and const do not.",
      "= assigns. === compares. if (n = 0) is an assignment, not a test.",
    ],
  },
  typescript: {
    how: "TypeScript uses the same var, let, and const as JavaScript. Scope, hoisting, the TDZ, and closures are unchanged at runtime — types are erased. var is still legal; it is not recommended for modern apps for the same reasons as in JavaScript.",
    example: `const n: number = 7;
let total: number = 0;
total = total + n;`,
    keywords: [
      {
        name: "var",
        use: "Same JavaScript var: function-scoped, hoisted to undefined.",
        modern: false,
        whyNotModern:
          "Same leaks and hoisting surprises as JavaScript. Types do not fix that.",
      },
      {
        name: "let",
        use: "Block-scoped, TDZ, reassign allowed. Add a type if inference is not enough.",
      },
      {
        name: "const",
        use: "Block-scoped, TDZ, no rebinding. const n: number = 7 is the usual form.",
      },
    ],
    sections: [
      {
        heading: "Same rules as JavaScript",
        body: "var / let / const hoist, scope, and close over environments exactly as they do in JavaScript. The compiler may flag a use-before-declare; the runtime still throws ReferenceError if that code runs.",
      },
      ...JS_VARIABLE_SECTIONS,
    ],
    watch: [
      "number is a TypeScript type, not a runtime class. It is erased.",
      "var is legal TypeScript. Scope and hoisting are still JavaScript’s.",
    ],
  },
  c: {
    how: "C declares a variable by writing the type, then the name. There is no var / let / const. The type is the declaration. You may assign at the same time or later.",
    example: `int n = 7;
int total;
total = 0;
total = total + n;
printf("%d\\n", total);`,
    keywords: [
      { name: "int n;", use: "Declares n as an integer. Until you assign, the value is garbage." },
      { name: "int n = 7;", use: "Declares and assigns in one statement. Prefer this." },
    ],
    sections: [
      {
        heading: "Scope",
        body: "A local lives from its declaration to the end of the nearest { } block. An if or for with braces is its own scope. There is no function-wide leak the way JavaScript var leaks out of if.",
      },
      {
        heading: "Hoisting",
        body: "C does not hoist. Using n above int n is a compile error. Declaration order is the order that matters.",
      },
      {
        heading: "Storage",
        body: "Uninitialized locals are garbage. File-scope and static locals are zeroed. scanf writes through &n because C passes the address, not the name.",
      },
    ],
    watch: [
      "int n; without an initializer holds whatever was in that memory.",
      "scanf writes into a variable through &n — the address of n.",
    ],
  },
  go: {
    how: "Go’s keyword var means “declare a variable.” It is not JavaScript var: it does not leak from blocks and it is not hoisted to a usable undefined. Short declare := infers the type inside functions.",
    example: `var n int = 7    // declare with var and a type
var total int    // declared, zero value 0
total = total + n
a, b := 3, 5     // short declare; infers int
fmt.Println(a + b)`,
    keywords: [
      { name: "var", use: "Declares a name and its type. Zero value until you assign (0, \"\", false, nil)." },
      { name: ":=", use: "Short declare inside a function. Infers the type. At least one name must be new." },
    ],
    sections: [
      {
        heading: "Scope",
        body: "Go is block-scoped. A name declared in an if or for is not visible after that block. Go’s var is not JavaScript var: it does not leak from blocks.",
      },
      {
        heading: "Hoisting",
        body: "Go does not hoist names so you can read them above the declaration. Package-level var is initialized before main; locals exist from their declaration line.",
      },
      {
        heading: "Zero values",
        body: "var total int is 0, not garbage and not undefined. Unused locals are a compile error. That is stricter than JavaScript and C.",
      },
    ],
    watch: [
      "Go var is not JavaScript var. It does not leak out of blocks.",
      ":= only works inside functions. Package-level names use var.",
      "Unused variables are a compile error.",
    ],
  },
  php: {
    how: "PHP does not use var / let / const for ordinary locals. A variable is a $name. Assigning creates it. const and define() are for true constants, not everyday locals.",
    example: `$n = 7;
$total = 0;
$total = $total + $n;
echo $total;`,
    keywords: [
      { name: "$name", use: "The $ is required. Assignment creates the variable." },
      { name: "const / define()", use: "True constants, not a substitute for let/const locals." },
      {
        name: "$$n",
        use: "Variable-variables. The name is data.",
        modern: false,
        whyNotModern: "Makes names dynamic and hides typos. Use arrays or objects.",
      },
    ],
    sections: [
      {
        heading: "Scope",
        body: "Ordinary $names are local to the function. An if block does not create a new local scope the way let does in JavaScript. global $n pulls a name from the global table.",
      },
      {
        heading: "Hoisting",
        body: "PHP does not hoist locals the way JavaScript var does. Reading $n before assignment is undefined (notice or Error), not a TDZ.",
      },
      {
        heading: "The dollar sign",
        body: "$ is part of the name syntax, not a type. Forgetting it is a parse error. $$n is a variable-variable — a real feature, not recommended for modern apps because it makes names data and hides typos.",
      },
    ],
    watch: [
      "Forgetting $ is a syntax error.",
      ".$ concatenates strings. + adds numbers.",
    ],
  },
};
