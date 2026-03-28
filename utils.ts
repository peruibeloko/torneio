import { createDefine } from "fresh";

// This specifies the type of "ctx.state" which is used to share
// data among middlewares, layouts and routes.
export interface State {
  shared: string;
}

export const define = createDefine<State>();

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
