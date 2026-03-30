export class Queue<T> {
  #q: T[];

  constructor() {
    this.#q = [];
  }

  get length() {
    return this.#q.length;
  }

  nq(...x: T[]) {
    this.#q.unshift(...x);
  }

  dq() {
    return this.#q.pop()!;
  }

  peekLast() {
    return this.#q.at(0)!;
  }

  peekFirst() {
    return this.#q.at(-1)!;
  }

  setLast(x: T) {
    this.#q[0] = x;
  }
}
