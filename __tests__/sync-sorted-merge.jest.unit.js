const printMergeLogsSync = require('../solution/sync-sorted-merge');
const LogSource = require('../lib/log-source');
const Printer = require('../lib/printer');

describe('printMergeLogsSync', () => {
   it('should print logs in chronological order from multiple sources', () => {
      const logSources = [new LogSource(), new LogSource()];
      const printer = new Printer();
      printMergeLogsSync(logSources, printer);
      expect(printer.logsPrinted).toBeGreaterThan(200);
   });

   it('should handle empty log sources', () => {
      const logSources = [new LogSource(), []];
      const printer = new Printer();
      printMergeLogsSync(logSources, printer);
      expect(printer.logsPrinted).toBeGreaterThan(0);
   });

   it('should handle a large number of sources', () => {
      const baseDate = new Date('2023-08-14T10:00:00Z');
      const logSources = Array(1000)
         .fill()
         .map((_, i) => new LogSource());
      const printer = new Printer();
      printMergeLogsSync(logSources, printer);
      expect(printer.logsPrinted).toBeGreaterThan(1000);
   });
});
