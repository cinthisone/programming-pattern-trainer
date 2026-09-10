import type { LanguagePrimers, PrimerSection } from "@/lib/curriculum/primer-model";

const JS_LOOP_SECTIONS: PrimerSection[] = [
  {
    heading: "The counted for",
    body: "for (init; condition; step) runs init once, then repeats while condition is true, then runs step. i = 1; i <= n; i++ visits 1 through n. i < n would skip n. The condition is checked before each body, so if it starts false the body never runs.",
    example: `for (let i = 1; i <= n; i++) {
  console.log(i);
}`,
  },
  {
    heading: "Scope of the counter",
    body: "let i in the for header is scoped to that loop (including the condition and step). Each iteration of a for (let i ...) gets a fresh i, which matters if you create functions inside the loop. var i is function-scoped and one shared binding — closures inside the loop all see the final i. var in a for is not recommended for modern apps.",
    example: `for (let i = 1; i <= 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// 1 2 3 with let; 4 4 4 with var`,
  },
  {
    heading: "for...of vs for...in",
    body: "for...of walks values of an iterable (arrays, strings, Set). for...in walks enumerable keys as strings, including inherited ones. for...in on an array is a classic bug: you get \"0\", \"1\", plus any extra properties. A learning tool has to mention it. It is not recommended for modern apps on arrays — use for...of, or a counted for when you need the index.",
    example: `const nums = [10, 20, 30];
for (const value of nums) {
  total += value;
}
for (let i = 0; i < nums.length; i++) {
  total += nums[i];
}`,
  },
  {
    heading: "while and do...while",
    body: "while (cond) { } is a loop whose only header is the condition. You must change something inside or it never ends. do { } while (cond) runs the body once before the first check. for is the usual counted loop; while is the usual “until a flag changes” loop.",
  },
  {
    heading: "break, continue, infinite loops",
    body: "break leaves the loop. continue skips the rest of this pass. Forgetting i++ (or the while update) is an infinite loop; the page or process hangs until you stop it. There is no range() — you write the three-part header yourself.",
  },
];

export const LOOPS: LanguagePrimers = {
  python: {
    how: "Python’s usual counted loop is for i in range(start, end). range stops before end, so include n with range(1, n + 1). while cond: is the condition-only loop. There is no C-style for (i = 0; i < n; i++).",
    example: `for i in range(1, n + 1):
    print(i)`,
    keywords: [
      { name: "for ... in", use: "Walks an iterable. Each pass binds the next item to the name." },
      { name: "range(a, b)", use: "Integers a, a+1, …, b-1. Empty if a >= b." },
      { name: "while", use: "Repeat while the condition stays true. You must change the condition." },
    ],
    sections: [
      {
        heading: "range is exclusive on the right",
        body: "range(1, n) never yields n. That is the usual off-by-one. range(n) is 0..n-1, which is what you want when indexing an n-length list. range(1, n + 1) is 1..n when you are counting.",
      },
      {
        heading: "The loop name is ordinary",
        body: "i is assigned each pass. You rarely write i = i + 1. After the loop, i remains the last value (or is unset if the loop never ran). An if inside the loop does not create a new i.",
      },
      {
        heading: "while and else",
        body: "while cond: repeats until cond is false. Python’s for/else and while/else run the else when the loop was not broken — a real feature, uncommon in other languages. break skips that else. A learning tool mentions it; most modern code just uses a flag or a return.",
      },
      {
        heading: "enumerate",
        body: "for i, value in enumerate(nums, start=1) gives index and value together. Prefer that over range(len(nums)) when you need both.",
      },
    ],
    watch: [
      "range(1, n) stops at n - 1. Use n + 1 to include n.",
      "i is assigned each pass; you rarely increment it yourself.",
      "An empty range means the body never runs.",
    ],
  },
  javascript: {
    how: "The counted loop is C-style: initializer, condition, increment. let i belongs to the loop. while is the condition-only form. for...of walks values. for...in walks keys and is not recommended for arrays in modern apps.",
    example: `for (let i = 1; i <= n; i++) {
  console.log(i);
}`,
    keywords: [
      { name: "for (;;)", use: "Counted loop. init once, then condition, body, step." },
      { name: "for...of", use: "Walks values of an iterable." },
      { name: "while", use: "Repeat while the condition is true." },
      {
        name: "for...in",
        use: "Walks enumerable keys as strings.",
        modern: false,
        whyNotModern: "On arrays you get indexes as strings plus extra keys. Use for...of or a counted for.",
      },
      {
        name: "var i in for",
        use: "One function-scoped i shared by every iteration.",
        modern: false,
        whyNotModern: "Closures in the loop all see the final i. Use let.",
      },
    ],
    sections: JS_LOOP_SECTIONS,
    watch: [
      "i <= n includes n. i < n does not.",
      "let i belongs to the loop. var i leaks.",
      "for...in is for keys, not array values.",
    ],
  },
  typescript: {
    how: "TypeScript loops are JavaScript loops. i is a number in a counted for. for...of on number[] yields number. Types do not add a new loop keyword.",
    example: `for (let i = 1; i <= n; i++) {
  console.log(i);
}`,
    keywords: [
      { name: "for (let i = 0; i < n; i++)", use: "Same counted for as JavaScript. i is number." },
      {
        name: "for...in",
        use: "Still walks keys. Typing it as number is a lie if you use it on arrays.",
        modern: false,
        whyNotModern: "Same as JavaScript. Use for...of or a counted for.",
      },
    ],
    sections: [
      {
        heading: "Same rules as JavaScript",
        body: "Scope of let i, var pitfalls, for...of vs for...in, and while are unchanged at runtime. The type checker can infer i as number and value as the element type.",
      },
      ...JS_LOOP_SECTIONS,
    ],
    watch: [
      "TypeScript does not add a new loop. It type-checks i.",
      "for...in keys are string, not number.",
    ],
  },
  c: {
    how: "C’s counted for is the ancestor of JavaScript’s: init, condition, step. i is usually an int. while and do-while exist. There is no for-each on arrays; you walk with an index and keep n yourself.",
    example: `for (int i = 1; i <= n; i++) {
    printf("%d\\n", i);
}`,
    keywords: [
      { name: "for", use: "init; condition; step. Condition 0 stops." },
      { name: "while / do-while", use: "Condition-only. do-while runs the body at least once." },
    ],
    sections: [
      {
        heading: "Off-by-one",
        body: "i <= n includes n. i < n is the usual “walk an array of length n” form (indexes 0..n-1). Mixing them is the classic bug. Forgetting i++ is an infinite loop.",
      },
      {
        heading: "Where i lives",
        body: "for (int i = 1; ...) declares i for the loop only (C99). Declaring int i; before the loop makes i visible after, with the last value. There is no let/var split, but the block still matters.",
      },
      {
        heading: "while",
        body: "while (n > 0) { n--; } is the condition-only loop. The condition is an integer: 0 stops, non-zero continues. do-while checks after the body.",
      },
    ],
    watch: [
      "Declare int i in the for header (C99) or before the loop.",
      "Forgetting i++ makes an infinite loop.",
      "i < n for arrays of length n. i <= n when counting 1..n.",
    ],
  },
  go: {
    how: "Go has one loop keyword: for. The three-part form is the counted loop. for cond { } is while. for { } is infinite. for i, v := range slice walks indexes and values. There is no while keyword.",
    example: `for i := 1; i <= n; i++ {
    fmt.Println(i)
}`,
    keywords: [
      { name: "for i := 1; i <= n; i++", use: "Counted loop. i is declared for the loop." },
      { name: "for cond { }", use: "While-loop. cond must be a bool." },
      { name: "for range", use: "Walk a slice, array, map, or string." },
    ],
    sections: [
      {
        heading: "One keyword",
        body: "Everything that is while or for-each in other languages is still for. That is a design choice, not a missing feature. if you write for n { } it will not compile — n is not a bool.",
      },
      {
        heading: "range",
        body: "for i, v := range nums copies v each pass. If you take &v thinking you captured each element, you captured the same loop variable (older Go) or a new one (Go 1.22+). A learning tool should mention that history; modern Go (1.22+) gives each iteration its own v.",
      },
      {
        heading: "Scope",
        body: "i := 1 in the for header is scoped to the loop. After the loop, i is not visible. break and continue work as in C. There is no do-while; write for { ... if !cond { break } } if you need “at least once.”",
      },
    ],
    watch: [
      "There is no while keyword. A condition-only for is the while.",
      "i := 1 declares i for the loop body.",
      "range on a slice gives index, value.",
    ],
  },
  php: {
    how: "PHP’s counted for matches C and JavaScript, with $ on the counter. foreach ($nums as $value) walks values. while is the condition-only loop. Forgetting $i++ never ends.",
    example: `for ($i = 1; $i <= $n; $i++) {
    echo $i;
}`,
    keywords: [
      { name: "for", use: "C-style counted loop. Keep $ on $i and $n." },
      { name: "foreach", use: "Walk array values, or $k => $v for keys." },
      { name: "while", use: "Repeat while the condition is true." },
    ],
    sections: [
      {
        heading: "foreach vs for",
        body: "foreach ($nums as $value) is the usual walk. foreach ($nums as $i => $value) gives key and value. A counted for is for 1..n or when you need the index math yourself. foreach by value copies; foreach (&$value) is a reference — leftover $value after the loop is a classic PHP bug. Modern code avoids the reference form unless you must mutate in place, and unset($value) after if you use it.",
      },
      {
        heading: "Scope",
        body: "for does not create a new function scope. $i remains after the loop. An if inside does not hide $i. There is no let.",
      },
      {
        heading: "Infinite loops",
        body: "Leave out $i++ and the condition stays true. while (true) with a break is legal. Same rule as every C-family loop: something in the body or the step must make the condition false.",
      },
    ],
    watch: [
      "$i++ is the increment. Leave it out and the loop never ends.",
      "Keep $ on both $i and $n.",
      "foreach ($a as &$v) leaves $v bound; unset it or do not use &.",
    ],
  },
};
