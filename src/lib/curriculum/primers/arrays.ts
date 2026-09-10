import type { LanguagePrimers, PrimerSection } from "@/lib/curriculum/primer-model";

const JS_ARRAY_SECTIONS: PrimerSection[] = [
  {
    heading: "Indexes start at 0",
    body: "The first element is nums[0]. The last is nums[nums.length - 1], or nums[n - 1] when n is the length you just read. Asking for nums[n] is undefined, not an error. That silent undefined is a common bug.",
    example: `const nums = [10, 20, 30];
console.log(nums[0], nums[nums.length - 1]); // 10 30`,
  },
  {
    heading: "length and holes",
    body: "nums.length is the count. JavaScript arrays can have holes: [10, , 30] has length 3 and a missing 1. forEach and map skip holes; a counted for sees undefined there. Modern apps rarely create holes on purpose.",
  },
  {
    heading: "Walking the list",
    body: "for...of walks values. A counted for walks indexes when you need i. for...in walks keys as strings and is not recommended for arrays in modern apps (extra properties, string indexes). Array methods (map, filter, reduce) are related tools on top of the same list.",
    example: `let total = 0;
for (const value of nums) {
  total += value;
}`,
  },
  {
    heading: "Mutation vs copy",
    body: "nums.push, nums[i] = x, and splice change the same array. slice and map return new arrays. const nums = [1] still lets you mutate the contents; const only blocks nums = other. Passing an array into a function does not copy it — both names see the same object.",
  },
];

export const ARRAYS: LanguagePrimers = {
  python: {
    how: "A list is a mutable sequence. Index 0 is the first item. Negative indexes count from the end: nums[-1] is the last. len(nums) is the length. for value in nums walks values. Slicing copies.",
    example: `nums = [10, 20, 30]
print(nums[0], nums[-1])
for value in nums:
    total += value`,
    keywords: [
      { name: "list", use: "Mutable ordered sequence. [10, 20, 30]." },
      { name: "len / [i] / [-1]", use: "Length, index, last element." },
    ],
    sections: [
      {
        heading: "Indexing",
        body: "nums[0] is the first. nums[n - 1] and nums[-1] are the last when the list is non-empty. nums[n] raises IndexError — Python does not return None. Empty list: both [0] and [-1] raise.",
      },
      {
        heading: "Walking",
        body: "for value in nums visits each element. for i, value in enumerate(nums) gives index and value. range(len(nums)) is the older index walk; enumerate is the usual modern form when you need i.",
      },
      {
        heading: "Mutation, copy, and references",
        body: "nums.append and nums[i] = x change the list. slicing nums[:] copies. Assignment b = nums does not copy — both names are the same list. That is why helper functions that append to a default list=[] are a classic bug.",
      },
      {
        heading: "list vs tuple",
        body: "A tuple is an immutable sequence. You will see (10, 20) as a related structure. Lists are the default when the problem says “array.”",
      },
    ],
    watch: [
      "Slicing copies. nums[1:1 + n] is a new list.",
      "len(nums) is the length, not nums.length.",
      "Out-of-range index is IndexError, not undefined.",
    ],
  },
  javascript: {
    how: "Arrays are 0-indexed objects with a length. They grow as needed. Use [i], .length, for...of, or a counted for. They are passed by sharing the same object, not by copying.",
    example: `const nums = [10, 20, 30];
console.log(nums[0], nums[n - 1]);
for (const value of nums) {
  total += value;
}`,
    keywords: [
      { name: "[] / length", use: "Index and count. Missing index is undefined." },
      { name: "for...of", use: "Walk values." },
      {
        name: "for...in on arrays",
        use: "Walks keys, not a safe array walk.",
        modern: false,
        whyNotModern: "String indexes and extra properties. Use for...of or a counted for.",
      },
    ],
    sections: JS_ARRAY_SECTIONS,
    watch: [
      "for...of walks values. for...in walks keys — skip it for arrays.",
      "nums.length is the count.",
      "nums[n] is undefined, not an exception.",
    ],
  },
  typescript: {
    how: "number[] is a JavaScript array with a type. Indexing and loops match JavaScript. The type checker may treat nums[i] as number | undefined when noUncheckedIndexedAccess is on.",
    example: `const nums: number[] = [10, 20, 30];
console.log(nums[0], nums[n - 1]);`,
    keywords: [
      { name: "number[]", use: "Array of numbers at compile time. Still a JS array at runtime." },
      { name: "Array<T>", use: "The same thing as T[]." },
    ],
    sections: [
      {
        heading: "Same structure as JavaScript",
        body: "length, holes, mutation, and for...of are unchanged. Types are erased. A tuple type [number, number] is a related, fixed-length array type — not what these problems use.",
      },
      ...JS_ARRAY_SECTIONS,
    ],
    watch: [
      "nums[i] may be undefined to the type checker if i is arbitrary.",
      "The runtime is still a JavaScript array.",
    ],
  },
  c: {
    how: "A C array has a fixed size you choose up front: int nums[1000]. It does not store its length. You keep n yourself. Index 0 is the first. Writing nums[n] is undefined behavior — not a clean error.",
    example: `int nums[1000];
for (int i = 0; i < n; i++) {
    scanf("%d", &nums[i]);
}
printf("%d %d\\n", nums[0], nums[n - 1]);`,
    keywords: [
      { name: "type name[size]", use: "Fixed storage. size is not the live count; n is." },
      { name: "nums[i]", use: "Index. No bounds check." },
    ],
    sections: [
      {
        heading: "No length field",
        body: "sizeof nums / sizeof nums[0] is the allocated size, not how many values you read. After scanf n items, the live length is n. Passing nums to a function decays to a pointer — the callee cannot see the allocated size unless you pass n.",
      },
      {
        heading: "Bounds",
        body: "C will not throw on nums[-1] or nums[n]. That is undefined behavior: it might crash, or it might quietly corrupt memory. These problems keep n <= the declared size. That constraint is the language, not the puzzle being cute.",
      },
      {
        heading: "Walking",
        body: "for (int i = 0; i < n; i++) is the walk. There is no for-each. scanf(\"%d\", &nums[i]) writes through a pointer to that slot.",
      },
    ],
    watch: [
      "C arrays do not know their length. You keep n yourself.",
      "Writing past n - 1 is undefined behavior.",
      "The array size in brackets is capacity, not n.",
    ],
  },
  go: {
    how: "A slice is a view over an array: pointer, length, capacity. make([]int, n) gives length n. s[i] panics if i is out of range. len(s) is the length. append may allocate a new backing array.",
    example: `nums := make([]int, n)
for i := 0; i < n; i++ {
    fmt.Scan(&nums[i])
}
fmt.Println(nums[0], nums[n-1])`,
    keywords: [
      { name: "[]int", use: "Slice of ints. Not a fixed array." },
      { name: "make / len / append", use: "Create, measure, grow." },
    ],
    sections: [
      {
        heading: "Array vs slice",
        body: "[3]int is a fixed array (value type). []int is a slice. Almost all Go code uses slices. Assigning a slice copies the header, not the elements — two slices can share backing storage.",
      },
      {
        heading: "len and cap",
        body: "len is how many elements you may index. cap is how far append can go before allocating. Indexing at len panics. append returns a (possibly new) slice; you must assign it: nums = append(nums, x).",
      },
      {
        heading: "range",
        body: "for i, v := range nums walks index and a copy of the value. for _, v := range nums skips the index. Out-of-range access panics instead of returning a zero quietly — that is stricter than JavaScript and C.",
      },
    ],
    watch: [
      "len(nums) is the length.",
      "append grows a slice; indexing past len panics.",
      "Assign the result of append.",
    ],
  },
  php: {
    how: "PHP arrays are ordered maps. Numeric keys still start at 0 unless you say otherwise. $nums[0] is the first. count($nums) is the length. foreach walks values. After splitting stdin, the first value is often index 1 because index 0 held n.",
    example: `$nums = [10, 20, 30];
echo $nums[0] . ' ' . $nums[count($nums) - 1];`,
    keywords: [
      { name: "$nums[$i]", use: "Key access. Missing key is null plus a warning (or Error)." },
      { name: "count / foreach", use: "Length and walk." },
    ],
    sections: [
      {
        heading: "Map, not a C array",
        body: "Keys can be ints or strings. $a[] = 1 appends. Unset holes do not reindex unless you array_values. That is why “arrays” in PHP behave like dictionaries that remember insertion order.",
      },
      {
        heading: "Indexes from stdin",
        body: "If tokens[0] is n, the first list value is tokens[1] and the last is tokens[n]. Off-by-one here is mixing the length prefix with the payload.",
      },
      {
        heading: "Copy vs reference",
        body: "Assigning $b = $a copies on write. foreach ($a as &$v) is a reference walk — leftover $v after the loop mutates the last element later. Modern apps avoid that form unless they unset($v).",
      },
    ],
    watch: [
      "count($nums) is the length.",
      "After reading n as tokens[0], the first value is tokens[1].",
      "Missing keys are not a silent undefined you should rely on.",
    ],
  },
};
