'use strict';

const MinHeap = require('./min-heap');

// Print all entries, across all of the *async* sources, in chronological order.

module.exports = (logSources, printer) => {
   return new Promise(async (resolve, reject) => {
      await printMergeLogsAsync(logSources, printer)
         .then(() => {
            console.log('Async sort complete.');
            resolve();
         })
         .catch(reject);
   });
};
// method to print the logs using async methods
async function printMergeLogsAsync(logSources, printer) {
   // start by creating min heap
   const heap = new MinHeap();
   try {
      await Promise.all(
         await logSources.map(async (source, idx) => {
            const record = await source.popAsync();
            if (record) {
               heap.insert({ sourceIndex: idx, record });
            }
         })
      );
      while (heap.size() > 0) {
         const { sourceIndex, record } = heap.extractMin();
         printer.print(record);
         // Get the next entry from the same source
         const nextRecord = await logSources[sourceIndex].popAsync();
         if (nextRecord) {
            heap.insert({ sourceIndex, record: nextRecord });
         } else {
            printer.done();
            break;
         }
      }
   } catch (err) {
      console.error(err);
   }
}
