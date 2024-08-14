'use strict';
const fs = require('fs');

// Print all entries, across all of the sources, in chronological order.

module.exports = (logSources, printer) => {
   if (!logSources.length || logSources.length > 0) {
      mergeLogsSynchronous(logSources, printer);
      printer.done();
   }
   return console.log('Sync sort complete.');
};

function mergeLogsSynchronous(logSources, printer) {
   const heap = new MinHeap();
   // Initialize the heap with the first entry from each source
   for (let i = 0; i < logSources.length; i++) {
      // Since the source record are poped chronologically, we have guarantee that
      // records will come already sorted from the source
      const entry = logSources[i].pop();
      if (entry) {
         heap.insert({ sourceIndex: i, entry }); // each source is marked with index
      }
   }

   // Process entries
   while (heap.size() > 0) {
      const { sourceIndex, entry } = heap.extractMin();
      printer.print(entry);
      // Get the next entry from the same source
      const nextEntry = logSources[sourceIndex].pop();
      if (nextEntry) {
         heap.insert({ sourceIndex, entry: nextEntry });
      }
   }
}
// Implementation of Min-Heap with percolateUp [ known as bubbleUp ] / percolateDown [ known as bubbleDown ]
class MinHeap {
   constructor() {
      this.heap = [];
   }

   insert(item) {
      this.heap.push(item);
      this.percolateUp(this.heap.length - 1);
   }

   extractMin() {
      if (this.heap.length === 0) return null;
      if (this.heap.length === 1) return this.heap.pop();

      const min = this.heap[0];
      this.heap[0] = this.heap.pop();
      this.percolateDown(0);
      return min;
   }

   percolateUp(index) {
      while (index > 0) {
         const parentIndex = Math.floor((index - 1) / 2);
         if (this.heap[parentIndex].entry.date <= this.heap[index].entry.date) break;
         //  swap the value of the heap
         const tmp = this.heap[index];
         this.heap[index] = this.heap[parentIndex];
         index = parentIndex;
      }
   }

   percolateDown(index) {
      while (true) {
         let smallest = index;
         const leftChild = 2 * index + 1;
         const rightChild = 2 * index + 2;

         if (
            leftChild < this.heap.length &&
            this.heap[leftChild].entry.date < this.heap[smallest].entry.date
         ) {
            smallest = leftChild;
         }
         if (
            rightChild < this.heap.length &&
            this.heap[rightChild].entry.date < this.heap[smallest].entry.date
         ) {
            smallest = rightChild;
         }

         if (smallest === index) break;

         [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
         index = smallest;
      }
   }

   size() {
      return this.heap.length;
   }
}
