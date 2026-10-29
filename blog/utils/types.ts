export type MultiLevelPick<
  Obj,
  Path extends string,
> = Path extends `${infer Front}.${infer Rest}`
  ? Front extends keyof Obj
    ? MultiLevelPick<Obj[Front], Rest>
    : never
  : Path extends keyof Obj
    ? Obj[Path]
    : never;
