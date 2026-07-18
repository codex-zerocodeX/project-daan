export type PriorityComparator<T> = (left: T, right: T) => number;

export class MinPriorityQueue<T> {
  private readonly value: T[] = [];

  constructor(private readonly compare: PriorityComparator<T>) {}

  get size() {
    return this.value.length;
  }

  push(item: T) {
    this.value.push(item);
    this.bubbleUp(this.value.length - 1);
  }

  pop(): T | undefined {
    const first = this.value[0];
    const last = this.value.pop();
    if (this.value.length > 0 && last !== undefined) {
      this.value[0] = last;
      this.bubbleDown(0);
    }
    return first;
  }

  private bubbleUp(startIndex: number) {
    let index = startIndex;
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.compare(this.value[index], this.value[parentIndex]) >= 0) return;
      [this.value[index], this.value[parentIndex]] = [this.value[parentIndex], this.value[index]];
      index = parentIndex;
    }
  }

  private bubbleDown(startIndex: number) {
    let index = startIndex;
    while (true) {
      const leftIndex = index * 2 + 1;
      const rightIndex = leftIndex + 1;
      let smallestIndex = index;
      if (leftIndex < this.value.length && this.compare(this.value[leftIndex], this.value[smallestIndex]) < 0) {
        smallestIndex = leftIndex;
      }
      if (rightIndex < this.value.length && this.compare(this.value[rightIndex], this.value[smallestIndex]) < 0) {
        smallestIndex = rightIndex;
      }
      if (smallestIndex === index) return;
      [this.value[index], this.value[smallestIndex]] = [this.value[smallestIndex], this.value[index]];
      index = smallestIndex;
    }
  }
}
