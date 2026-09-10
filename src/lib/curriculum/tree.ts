export interface ConceptRecord {
  id: string;
  parentId: string | null;
  slug: string;
  name: string;
  sortOrder: number;
}

export interface ConceptNode extends ConceptRecord {
  children: ConceptNode[];
}

export function buildConceptTree(rows: ConceptRecord[]): ConceptNode[] {
  const byParent = new Map<string | null, ConceptRecord[]>();

  for (const row of rows) {
    const key = row.parentId;
    const list = byParent.get(key) ?? [];
    list.push(row);
    byParent.set(key, list);
  }

  const sortSiblings = (nodes: ConceptRecord[]) =>
    nodes.slice().sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));

  const walk = (parentId: string | null): ConceptNode[] =>
    sortSiblings(byParent.get(parentId) ?? []).map((row) => ({
      ...row,
      children: walk(row.id),
    }));

  return walk(null);
}
