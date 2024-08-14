'use strict';
const fs = require('fs');
const MinHeap = require('./min-heap');

// Print all entries, across all of the sources, in chronological order.

module.exports = (logSources, printer) => {
   if (!logSources.length || logSources.length > 0) {
      printLogsSynchronous(logSources, printer);
   }
   return console.log('Sync sort complete.');
};

function printLogsSynchronous(logSources, printer) {
   const heap = new MinHeap();
   // Initialize the heap with the first entry from each source
   for (let i = 0; i < logSources.length; i++) {
      // Since the source record are poped chronologically, we have guarantee that
      // records will come already sorted from the source
      const record = logSources[i].pop();
      console.log(record);
      if (record) {
         heap.insert({ sourceIndex: i, record }); // each record is marked with its source id
      }
   }

   // Process entries
   while (heap.size() > 0) {
      // extract the minimum and its source index to be later replaced
      const { sourceIndex, record } = heap.extractMin();
      printer.print(record);
      // get the follwing entry from the same source which the minimum was take from
      const nextRecord = logSources[sourceIndex].pop();
      if (nextRecord) {
         heap.insert({ sourceIndex, record: nextRecord });
      } else {
         printer.done();
      }
   }
}
