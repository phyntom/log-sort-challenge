'use strict';

const LogSource = require('../lib/log-source');
const MinHeap = require('./min-heap');

// Print all entries, across all of the *async* sources, in chronological order.

module.exports = async (logSources, printer) => {
   try {
      const promise = await printMergeLogsAsync(logSources, printer);
      printer.done();
      console.log('Async sort complete.');
   } catch (err) {
      console.log(err);
   }
};
/**
 * function to print log asynchronously
 * @param {*} logSources
 * @param {*} printer
 */

async function printMergeLogsAsync(logSources, printer) {
   const heap = new MinHeap();
   const sourceCount = logSources.length;
   let fetchPromises = [];
   try {
      // start fetching logs from each source concurrently
      for (let index = 0; index < sourceCount; index++) {
         fetchPromises.push(await fetchLogs(index));
      }

      // concurrently fetch logs and push them to the heap
      function fetchLogs(sourceIndex) {
         return new Promise(async (resolve, reject) => {
            try {
               while (true) {
                  const record = await logSources[sourceIndex].popAsync();
                  if (record) {
                     heap.insert({ sourceIndex, record });
                     fetchPromises.push(fetchLogs(sourceIndex));
                     resolve({ success: true, message: 'Log inserted successfully' });
                  } else {
                     fetchPromises.splice(sourceIndex, 1);
                     resolve({ success: true, message: 'Source exhausted' });
                     break;
                  }
               }
            } catch (error) {
               reject({ success: false, message: 'An error occurred', error });
            }
         });
      }

      // continuously extract the min log from the heap and print
      while (fetchPromises.length > 0 || heap.size() > 0) {
         // wait for at least one fetch to complete if heap is empty
         if (heap.size() === 0) {
            await Promise.race(fetchPromises);
         }
         if (heap.size() > 0) {
            const { sourceIndex, record } = heap.extractMin();
            printer.print(record);
         }
         // remove resolved fetch promises
         fetchPromises = fetchPromises.filter((p) => p.status === 'pending');
      }
   } catch (err) {
      console.error(err);
   }
}

module.exports.printMergeLogsAsync = printMergeLogsAsync;
