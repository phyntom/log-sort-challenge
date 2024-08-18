<img align="left" width="100px" height="100px" src="/assets/seso-eng-logo.png">

# Seso Engineering | Challenge: Log Sorting

<br>
<br>

## Choice of Datastructure

Although many datastructure can be used for this solution, I found that MinHeap can lead to more efficient solution even in case of million sources.

## Details of the Solution

1. Created a MinHeap datastructure to effciently keep track of earliest log entry base on the date across all the source
2. Initialization of the heap:
   -  Asynchronously and synchronosy poping the first entry on each log source available for asynchronous it is done concurrently
   -  If We get the record, it is going to be inserted in the heap with a created sourceIndex that will be used later when we replace
      the record from another record from the same log source
   -  For sync we leverage `pop()` and async `popAsync()`
   -  Once the heap is initialized we loop into it and extract the minimum record based on the date
   -  When the record is extracted from the heap it is replace by another one from the same source
   -  We continue until the heap is empty meaning we have covered all the log sources
   -  The heap implementation is in separate module file `min-heap.js`
   -  Two method are created for each implementation `printMergeLogsSync` for sync and `printMergeLogsAsync`
   -  In those two methods that is where all the processing happens but they differ from the use of `asyn/await` and `popAsync` as well as
      concurrent processing

## Space Complexity: O(n)

The space complexity for this solution is O(n) where N is the number of log sources as we only keep one entry from each source in memory at time.

## Time Complexity: O(M log N):

The time complexity for this solution is O(M log N). M represent the number of entries in all sources and N represent the number of sources we are processing from. Note that each push or insertion take Log N time, which is significant effecient even if we do that M times.

## Large dataset handling

Priority Queues are known to be efficient in priority management because of the efficiency of insertion and removal operation.Since we can load the whole dataset in memory as stated in the instructions, the best way is to operate on subset of data and process them immediately.

```javascript
   // since I want to print the log in chronological
   // order I will always take the minimum
   // which will take the root node.
   extractMin() {
      if (this.heap.length === 0) return null;
      if (this.heap.length === 1) return this.heap.pop();

      const min = this.heap[0];
      this.heap[0] = this.heap.pop();
      this.percolateDown(0);
      return min;
   }
```

## Memory footprint

The solution leverages the use of MinHeap which is memory efficient as well and it only keeps one record from each source in memory at a time.

## Asynchronous Operation Handling:

THe solution handle async operation properly by using:

-  `async/await` and also leverate `popAsync` method provided by the `log-source.js`.
-  To process logs asynchronously, I added a function called `printMergeLogsAsync` which does two things:
-  Fetch logs from each source concurrently and push all the fetched promises into array
-  Pre-Fetching: To address the issue that may arise after printing, I'm fetching the next log after poping one to avoid waiting the printing process `fetchPromises.push(fetchLogs(sourceIndex))`.
-  Source exhaustion : `fetchLogs` function resolve the promise when a source is exhausted and removed fetcehd promises `fetchPromises.splice(sourceIndex,1)`
-  Concurrency: The function initiates fetch operations for all sources concurrently and doesn't wait for each fetch to complete before printing.
-  Non-blocking: I introduced `await Promise.race(fetchPromises)` since we need to wait to have at least one promise to process when the heap is empty, which is necessary to ensure we have logs to process.
-  Continuous fetching: After printing a log, it immediately starts fetching the next log from that source without waiting
-  Clean up : At the end we need to clean up the fetchPromises that have resolved

## Solution Limitations

The main limitations of this solution may be the inital load of one record from earch source into memory. If we are dealing with large number of log sources, the initial process can lead to a use of lot memory. However in most practical scenarios, this should be cause any issue and it is a necessay trade-off to make sure that we maintain chronological order across all the log sources.

## Async Operation

### On 5K Sources

```text
***********************************
Logs printed: 600975
Time taken (s): 17.349
Logs/s: 34640.32509078333
***********************************
```

### On 1K Sources

```text
***********************************
Logs printed: 120213
Time taken (s): 3.454
Logs/s: 34803.99536768963
***********************************
```

## Sync Operation

### On 5K Sources

```text
***********************************
Logs printed: 598420
Time taken (s): 17.983
Logs/s: 33276.98381805038
***********************************
```

#### On 1K Sources

```text
***********************************
Logs printed:            2865
Time taken (s):          0.104
Logs/s:                  27548.076923076926
***********************************
```

## Alternatives solution

Other solutions that can bring improvement could be when writting on disc by leveraging an external merge source and write each log source in temporary file. Then on the next step Merge sorted temporary files and finally clean up the temporary files.In this case we start writing an sorting immediately and we can even handle large dataset in case memory is an issue.

## Submitting

Create a GitHub repo and email your point of contact the link.

If - for whatever reason - you cannot create a GitHub repo for this challenge, it is also acceptable to 'zip' the directory and provide your submission as an email attachment.
