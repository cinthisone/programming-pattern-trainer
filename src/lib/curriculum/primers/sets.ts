import type { LanguagePrimers, PrimerSection } from "@/lib/curriculum/primer-model";

const JS_SET_SECTIONS: PrimerSection[] = [
  {
    heading: "Membership, not order",
    body: "A Set stores each value once. The question it answers is “have I seen this?” not “what index is it?” Iteration order in modern JavaScript is insertion order, but you still do not index seen[0]. Use .has, .add, .size.",
    example: `const seen = new Set();
for (const value of nums) {
  seen.add(value);
}
console.log(seen.size);`,
  },
  {
    heading: "How uniqueness is decided",
    body: "Set uses SameValueZero: NaN equals NaN, +0 equals -0, and objects are unique by identity. Two { x: 1 } literals are different members. Primitives with the same value collapse. That is why Set is for numbers and strings here, not for “same-looking objects” unless you intern them.",
  },
  {
    heading: "Set vs array of uniques",
    body: "You can unique an array with a nested loop or filter. That is O(n²) or easy to get wrong. Set add/has is average O(1). Modern apps use Set (or a Map) for membership. An array plus includes is fine for tiny n and is slower as n grows.",
  },
  {
    heading: "Objects that are not Set",
    body: "A plain object used as { [value]: true } can fake a set for string/number keys, with prototype-key pitfalls (\"__proto__\"). Object.create(null) or Map is the safer map form. new Set is the dedicated tool. The object-as-set pattern still appears in older code — learn it, prefer Set in modern apps.",
  },
];

export const SETS: LanguagePrimers = {
  python: {
    how: "set() is the built-in unique collection. add inserts; in tests membership; len is the distinct count. Elements must be hashable (ints and strings yes, lists no). Sets are unordered: do not index seen[0].",
    example: `seen = set()
for value in nums:
    seen.add(value)
print(len(seen))`,
    keywords: [
      { name: "set / add / in", use: "Create, insert, ask membership." },
      { name: "len(seen)", use: "Distinct count." },
    ],
    sections: [
      {
        heading: "Hashable elements",
        body: "A set is a hash table. ints, strings, tuples of hashables work. A list is unhashable — you cannot put a list in a set. That is why this problem uses integers.",
      },
      {
        heading: "Membership is the point",
        body: "value in seen is average O(1). value in some_list is O(n). Use a set when the question is “have I seen this?” Use a list when order and duplicates matter.",
      },
      {
        heading: "No index",
        body: "seen[0] is a TypeError. Convert to list(sorted(seen)) only when you need a stable order for output. set(nums) builds from an iterable in one step.",
      },
      {
        heading: "set vs dict keys",
        body: "A dict with dummy values is historically how Python faked sets. set exists now; dict is for key → value. frozenset is an immutable related type you can nest inside another set.",
      },
    ],
    watch: [
      "set(nums) builds it in one step.",
      "Sets are unordered. Do not index seen[0].",
      "Lists cannot be set elements.",
    ],
  },
  javascript: {
    how: "new Set() stores unique values. .add inserts, .has asks membership, .size is the count (not .length). It is the modern membership tool. Object-as-map still appears in older code and is not the default for new work.",
    example: `const seen = new Set();
for (const value of nums) {
  seen.add(value);
}
console.log(seen.size);`,
    keywords: [
      { name: "Set", use: "Unique values. add / has / size." },
      {
        name: "object as a set",
        use: "{ [key]: true } fakes membership with string keys.",
        modern: false,
        whyNotModern: "Prototype keys and string coercion. Use Set or Map.",
      },
    ],
    sections: JS_SET_SECTIONS,
    watch: [
      "Use .size, not .length.",
      "new Set(nums) fills from an array.",
      "Objects are unique by identity, not by fields.",
    ],
  },
  typescript: {
    how: "Set<number> is a JavaScript Set with a type parameter. Methods and uniqueness rules are unchanged at runtime. The type only documents what you intend to store.",
    example: `const seen = new Set<number>();
for (const value of nums) {
  seen.add(value);
}
console.log(seen.size);`,
    keywords: [
      { name: "Set<T>", use: "Typed Set. Runtime is still a JS Set." },
    ],
    sections: [
      {
        heading: "Same rules as JavaScript",
        body: "SameValueZero, insertion order, .size, and object identity are unchanged. Set<number> will not stop you from adding the wrong value if you use any, and it is erased at runtime.",
      },
      ...JS_SET_SECTIONS,
    ],
    watch: [
      "The type parameter documents what you store. It is still a JS Set.",
      ".size, not .length.",
    ],
  },
  c: {
    how: "C has no set type in this curriculum. For a small value range, a flag array records membership: seen[value] = 1. That is a set in spirit — unique keys, O(1) lookup — with a hard range limit. Nested loops can unique without extra memory and are O(n²).",
    example: `int seen[101] = {0};
int unique = 0;
if (!seen[value]) {
    seen[value] = 1;
    unique++;
}`,
    keywords: [
      { name: "seen[value]", use: "Flag array. Index is the key. 0 unknown, 1 seen." },
    ],
    sections: [
      {
        heading: "Why a flag array",
        body: "Hash tables are not in the C standard library the way Python set is. For values in 0..100, seen[101] is enough memory and O(1). That is why this problem’s constraints exist. Negative values or large ranges need a different structure (sorted unique, hash table you write yourself, or qsort + scan).",
      },
      {
        heading: "Initialization",
        body: "int seen[101] = {0} zeros every slot. Without that, flags are garbage and “already seen” is meaningless. unique counts rising edges: first time seen[value] is 0, set it to 1 and increment.",
      },
      {
        heading: "Not a general set",
        body: "You cannot insert an arbitrary int without a bound. This is a teaching stand-in so the language-independent problem still has a C solution. Learn the idea (membership flags); do not pretend C arrays are Python sets.",
      },
    ],
    watch: [
      "This only works when values fit the flag range (0..100 here).",
      "seen[value] is true once that number has appeared.",
      "Zero the array or the flags are garbage.",
    ],
  },
  go: {
    how: "map[int]bool is the usual set. The key existing means “already seen.” The zero value of a missing key is false, so if !seen[v] { seen[v] = true } both tests and inserts. len(seen) is the distinct count. A nil map panics on write — make or a literal first.",
    example: `seen := map[int]bool{}
if !seen[value] {
    seen[value] = true
    unique++
}`,
    keywords: [
      { name: "map[K]bool", use: "Set of K. Presence is the value." },
      { name: "len(seen)", use: "Distinct keys." },
    ],
    sections: [
      {
        heading: "Zero value as “missing”",
        body: "Reading seen[k] on a missing key returns false without inserting. comma-ok form v, ok := seen[k] tells missing from an explicit false. For a set, ok (or !seen[k] before assign) is the membership test.",
      },
      {
        heading: "Nil vs empty",
        body: "var seen map[int]bool is nil. Reads return zero; writes panic. seen := map[int]bool{} or make(map[int]bool) is empty and writable. Always initialize before add.",
      },
      {
        heading: "Iteration order",
        body: "ranging a map is deliberately randomized. Do not depend on order when printing uniques unless you collect and sort keys. That is a language rule, not a Judge0 quirk.",
      },
    ],
    watch: [
      "Reading a missing key returns the zero value, false.",
      "len(seen) is the distinct count.",
      "Initialize the map before writing.",
    ],
  },
  php: {
    how: "An associative array with the value as the key is a set. $seen[$value] = true; count($seen) is the distinct count. Keys are unique. PHP will coerce keys (int 1 and string \"1\" collide). That is the main pitfall versus a real set type.",
    example: `$seen = [];
$seen[$value] = true;
echo count($seen);`,
    keywords: [
      { name: "$seen[$value]", use: "Key = the element. Value = dummy true." },
      { name: "count($seen)", use: "Distinct keys." },
    ],
    sections: [
      {
        heading: "Key coercion",
        body: "PHP array keys are ints or strings. 1 and \"1\" are the same key. Floats truncate. That is not SameValueZero. For the integer problems here it is fine. For mixed types it is a bug factory. SplFixedArray and a true set library exist; this curriculum uses the array idiom because it is what you will actually see.",
      },
      {
        heading: "isset vs array_key_exists",
        body: "isset($seen[$k]) is false if the value is null. array_key_exists distinguishes missing from null. For a bool set, isset is enough. Learn both so null values in a real map do not fool you.",
      },
      {
        heading: "Not a hash set object",
        body: "There is no new Set(). The array is the structure. foreach ($seen as $value => $_) walks uniques. Insertion order is preserved in modern PHP, but uniqueness is still the point.",
      },
    ],
    watch: [
      "Keys are unique, so assigning twice does not grow the array.",
      "count($seen) is the distinct count.",
      "1 and \"1\" are the same key.",
    ],
  },
};
