// I choose to use MinHeap as it can offer me the possibility to find minimum of entries in O(1) time complexity
// Since I'm always storing the first entry of each log source this method is most effecient and practical one
// in real world scenario
module.exports = class MinHeap {
   constructor() {
      this.heap = [];
   }

   insert(item) {
      this.heap.push(item);
      this.percolateUp(this.heap.length - 1);
   }
   // since I want to print the log in chronological order I will always take the minimum
   // which will take the root node.
   extractMin() {
      if (this.heap.length === 0) return null;
      if (this.heap.length === 1) return this.heap.pop();

      const min = this.heap[0];
      this.heap[0] = this.heap.pop();
      this.percolateDown(0);
      return min;
   }
   // the function will move the value up if the date given date is smaller
   //  than date in parent node
   percolateUp(index) {
      while (index > 0) {
         const parentIndex = Math.floor((index - 1) / 2);
         if (this.heap[parentIndex].record.date <= this.heap[index].record.date) break;
         //  swap the value of the heap
         const tmp = this.heap[index];
         this.heap[index] = this.heap[parentIndex];
         index = parentIndex;
      }
   }
   //
   percolateDown(index) {
      while (true) {
         let smallerIdx = index;
         const leftChild = 2 * index + 1;
         const rightChild = 2 * index + 2;

         if (
            leftChild < this.heap.length &&
            this.heap[leftChild].record.date < this.heap[smallerIdx].record.date
         ) {
            smallerIdx = leftChild;
         }
         if (
            rightChild < this.heap.length &&
            this.heap[rightChild].record.date < this.heap[smallerIdx].record.date
         ) {
            smallerIdx = rightChild;
         }

         if (smallerIdx === index) break;

         [this.heap[index], this.heap[smallerIdx]] = [this.heap[smallerIdx], this.heap[index]];
         index = smallerIdx;
      }
   }

   size() {
      return this.heap.length;
   }
};
