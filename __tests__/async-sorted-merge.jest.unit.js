const printMergeLogsAsync = require('../solution/async-sorted-merge');
const LogSource = require('../lib/log-source');
const Printer = require('../lib/printer');

describe('printMergeLogsAsync', () => {
   // it('should print logs in chronological order from multiple sources', async () => {
   //    const logSources = [new LogSource(), new LogSource()];
   //    const printer = new Printer();
   //    await printMergeLogsAsync(logSources, printer);
   //    expect(new Date(printer.last).getTime()).toBeLessThan(new Date().getTime());
   // }, 5000);
   it('should handle a large number of sources', async () => {
      const baseDate = new Date('2023-08-14T10:00:00Z');
      const logSources = Array(100)
         .fill()
         .map((_, i) => new LogSource());
      const printer = new Printer();
      await printMergeLogsAsync(logSources, printer);
      expect(printer.logsPrinted).toBeGreaterThan(1000);
   }, 15000);
});
