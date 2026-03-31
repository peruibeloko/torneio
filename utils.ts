import { createDefine } from "fresh";

export const define = createDefine();

export const collectKv = async <T>(list: Deno.KvListIterator<T>) => {
  const out = [];
  const val = await list.next();
  do {
    out.push(val.value);
  } while (!val.done);
  return out;
};

export const collect = <T>(iter: IterableIterator<T>) => {
  const out = [];
  const val = iter.next();
  do {
    out.push(val.value);
  } while (!val.done);
  return out;
};
