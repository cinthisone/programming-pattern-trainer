import type { LanguagePrimers, PrimerSection } from "@/lib/curriculum/primer-model";

const JS_CONTROL_SECTIONS: PrimerSection[] = [
  {
    heading: "What a branch is",
    body: "A control structure chooses a path. The condition is evaluated once. If it is true, the if block runs and the else is skipped. If it is false, the else runs (when you wrote one). Only one of those blocks runs. else if chains extra questions in order and stops at the first true one.",
  },
  {
    heading: "Truthiness",
    body: "JavaScript will coerce non-booleans in an if. 0, \"\", null, undefined, NaN, and false are falsy. Everything else is truthy, including \"0\" and []. That is why even/odd should test n % 2 === 0, not if (n % 2). The remainder 0 is falsy, which happens to work, but if (n) is a different question (“is n non-zero?”).",
    example: `if (n % 2 === 0) {
  console.log("even");
} else {
  console.log("odd");
}

// if (n % 2) treats 0 as false, so it can look like even/odd,
// but you are relying on truthiness, not on “equals zero”.`,
  },
  {
    heading: "Blocks and scope",
    body: "Braces { } create a block. let and const declared inside the if are not visible after it. var declared inside the if is still visible in the whole function — that is one reason var is not recommended for modern apps. Always write braces, even for one line, so a later edit cannot attach to the wrong if.",
    example: `if (n % 2 === 0) {
  const label = "even";
  console.log(label);
}
// console.log(label); // ReferenceError — label was block-scoped`,
  },
  {
    heading: "= vs == vs ===",
    body: "= assigns. == compares after coercing types (\"0\" == 0 is true). === compares without coercion (\"0\" === 0 is false). if (n = 0) is an assignment that also happens to be falsy — a classic bug. Modern apps use === (and !==). == still exists so you can read older code; it is not recommended for modern apps because hidden coercions hide bugs.",
    example: `if (n === 0) {        // comparison
  console.log("zero");
}
// if (n = 0) { ... } // assignment; n becomes 0; usually a bug
// if (n == "0")      // true after coercion — usually not what you meant`,
  },
  {
    heading: "switch",
    body: "switch picks a case by ===. Without break, execution falls through into the next case — that is a real feature, used on purpose in old code, and a frequent accident. A learning tool has to show it. For modern apps, prefer if / else if or a lookup object unless fall-through is the point and you comment it.",
    example: `switch (n % 2) {
  case 0:
    console.log("even");
    break;
  default:
    console.log("odd");
}`,
  },
];

export const CONTROL_STRUCTURES: LanguagePrimers = {
  python: {
    how: "Python branches with if / elif / else. The condition has no required parentheses. Indentation is the block — there are no braces. The condition is made boolean with the usual truthiness rules, so write == 0 when you mean “equals zero.”",
    example: `if n % 2 == 0:
    print("even")
else:
    print("odd")`,
    keywords: [
      { name: "if", use: "Asks a yes-or-no question. The indented block runs only when the condition is true." },
      { name: "elif", use: "Another question, only if every if/elif above it was false." },
      { name: "else", use: "Runs when no condition above was true." },
    ],
    sections: [
      {
        heading: "Blocks are indentation",
        body: "A colon starts a suite. Every line in that suite must be indented the same amount. Dedent ends the block. Mixing tabs and spaces is a syntax error. There is no { } to fall back on.",
      },
      {
        heading: "Truthiness",
        body: "0, 0.0, \"\", [], {}, None, and False are falsy. Most other values are truthy. if n: means “n is not a falsy value,” not “n is True.” For even/odd, if n % 2 == 0 is the precise question.",
      },
      {
        heading: "Scope",
        body: "An if does not create a new local scope in Python. A name assigned inside the if is still local to the whole function. After a true branch, that name exists; after a false branch that skipped the assignment, using it is UnboundLocalError or NameError.",
        example: `if n % 2 == 0:
    label = "even"
else:
    label = "odd"
print(label)  # fine — both branches assign`,
      },
      {
        heading: "== vs = and is",
        body: "= assigns. == compares values. is compares object identity. Use == for numbers and strings. is None is the usual None check. Python 3.10+ match/case is a related control structure for structured patterns; if/elif remains the default for simple conditions.",
      },
    ],
    watch: [
      "A colon starts the block. Spaces, not braces.",
      "== tests equality. = assigns.",
      "Both branches must assign if you read the name after the if.",
    ],
  },
  javascript: {
    how: "JavaScript branches with if / else if / else. Parentheses around the condition are required. Braces around each branch should be treated as required. Conditions coerce to boolean unless you write ===, which is what modern apps should do.",
    example: `if (n % 2 === 0) {
  console.log("even");
} else {
  console.log("odd");
}`,
    keywords: [
      { name: "if / else", use: "Choose one path. else if chains extra questions in order." },
      {
        name: "==",
        use: "Loose equality. Coerces types before comparing.",
        modern: false,
        whyNotModern: "Hidden coercions (\"0\" == 0, \"\" == false) hide bugs. Use ===.",
      },
      {
        name: "switch fall-through",
        use: "Without break, the next case runs too.",
        modern: false,
        whyNotModern: "Easy to forget break. Prefer if/else or a lookup unless fall-through is deliberate.",
      },
    ],
    sections: JS_CONTROL_SECTIONS,
    watch: [
      "=== is strict equality. == will coerce types.",
      "Braces are optional for one line; write them anyway.",
      "if (n = 0) assigns. Write ===.",
    ],
  },
  typescript: {
    how: "TypeScript if / else is JavaScript’s, with extra checking. A condition that is always true or never a boolean can be a type error. Types do not replace the branch — they only describe the values you test.",
    example: `if (n % 2 === 0) {
  console.log("even");
} else {
  console.log("odd");
}`,
    keywords: [
      { name: "if / else", use: "Same as JavaScript. The condition is still evaluated at runtime." },
      {
        name: "==",
        use: "Still legal. Still coerces.",
        modern: false,
        whyNotModern: "Same as JavaScript. Types do not make == safe. Use ===.",
      },
    ],
    sections: [
      {
        heading: "Same rules as JavaScript",
        body: "Truthiness, block scope, = vs ===, and switch fall-through are unchanged at runtime. The compiler may narrow types inside a branch (after if (x === null) return, x is not null below).",
      },
      ...JS_CONTROL_SECTIONS,
    ],
    watch: [
      "Types do not replace if. They only check the values you branch on.",
      "=== still matters. number | string compared with == is a smell.",
    ],
  },
  c: {
    how: "C if looks like JavaScript: parentheses, braces, == to compare. There is no built-in boolean in older C; 0 is false and any non-zero is true. That makes if (n = 0) compile and run as “assign 0, then take the else.”",
    example: `if (n % 2 == 0) {
    printf("even\\n");
} else {
    printf("odd\\n");
}`,
    keywords: [
      { name: "if / else", use: "Condition in parentheses. Non-zero is true. 0 is false." },
      { name: "==", use: "Comparison. One = is assignment." },
      {
        name: "if (n = 0)",
        use: "Assigns 0 to n, then treats the result as the condition.",
        modern: false,
        whyNotModern: "Compiles, then silently takes the wrong branch. Always write ==.",
      },
    ],
    sections: [
      {
        heading: "No truthy strings",
        body: "C does not coerce objects. The condition is an integer (or something that becomes one). if (pointer) asks “not NULL?” if (n) asks “not zero?” For even/odd, if (n % 2 == 0) is the precise test. Remainder 0 is false, so if (n % 2) also happens to mean odd — do not rely on that style in new code; write the == 0 so the intent is obvious.",
      },
      {
        heading: "Blocks and scope",
        body: "Braces are a block. A variable declared inside the if is not visible after it (C99). Write braces even for one statement so else cannot bind to the wrong if (the dangling-else problem).",
      },
      {
        heading: "switch",
        body: "switch on integers and enums. case labels fall through without break. That is how C was designed; it is also a common bug. A learning tool shows it. For modern C, break every case unless you comment the fall-through.",
      },
    ],
    watch: [
      "if (n = 0) assigns. Write ==.",
      "0 is false. Any other int is true.",
      "Always brace if / else.",
    ],
  },
  go: {
    how: "Go if has no parentheses around the condition and requires braces, even for one line. The condition must be a bool — there is no truthiness. if n { } will not compile. You may declare a short variable in the if statement; it is scoped to the if/else.",
    example: `if n%2 == 0 {
    fmt.Println("even")
} else {
    fmt.Println("odd")
}`,
    keywords: [
      { name: "if / else", use: "Condition is a bool. Braces required. No parentheses." },
      { name: "if v := ...; v > 0", use: "Short declare scoped to the if/else chain." },
    ],
    sections: [
      {
        heading: "No truthiness",
        body: "if n is a compile error. You must write if n != 0 or if n%2 == 0. That is stricter than JavaScript, Python, C, and PHP, and it removes a class of bugs.",
      },
      {
        heading: "Scope of the short statement",
        body: "if n := value(); n%2 == 0 { } declares n for the if and else bodies only. After the whole if, n is gone. The opening { must stay on the if line because of automatic semicolons.",
        example: `if n := 4; n%2 == 0 {
    fmt.Println("even")
}
// n is not in scope here`,
      },
      {
        heading: "No ternary, no switch-on-bool required",
        body: "Go has no ?: operator. Use if/else. switch exists and does not fall through by default — each case breaks implicitly. That is the opposite of C and JavaScript.",
      },
    ],
    watch: [
      "The opening { must stay on the if line.",
      "if n%2 { } is invalid; the condition must be a bool.",
      "No parentheses around the condition.",
    ],
  },
  php: {
    how: "PHP if looks like JavaScript: parentheses, braces, === for a strict check. Loose == coerces in surprising ways (0 == \"foo\" was true in older PHP). Modern apps use ===. $ must stay on the variable inside the condition.",
    example: `if ($n % 2 === 0) {
    echo "even";
} else {
    echo "odd";
}`,
    keywords: [
      { name: "if / else / elseif", use: "Same shape as JavaScript. elseif is one word." },
      {
        name: "==",
        use: "Loose comparison with type juggling.",
        modern: false,
        whyNotModern: "0 == \"0\" and historical string/number quirks. Use === in modern PHP.",
      },
    ],
    sections: [
      {
        heading: "Truthiness",
        body: "0, 0.0, \"\", \"0\", [], null, and false are falsy. if ($n) is “is this a non-empty/non-zero value?”, not even/odd. Write $n % 2 === 0 when that is the question.",
      },
      {
        heading: "Scope",
        body: "An if does not create a new variable scope. $label assigned inside the if is the function’s $label. Both branches should assign if you read it afterward.",
      },
      {
        heading: "Assignment in the condition",
        body: "if ($n = 0) assigns, then tests the result. It is legal. It is almost always a bug. Modern code uses === and keeps assignments on their own line.",
      },
    ],
    watch: [
      "=== 0 is safer than == 0 when types are mixed.",
      "Keep $ on the variable inside the condition.",
      "elseif is one word; else if also works with braces.",
    ],
  },
};
