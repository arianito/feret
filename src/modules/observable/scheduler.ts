import throttleFn from 'lodash/throttle';
import debounceFn from 'lodash/debounce';
import { Message, ScheduleOptions } from './types';

export class Scheduler<T> {
  private mBuffer: Map<
    string,
    {
      fn: () => void;
      buffer: Array<Message<T>>;
    }
  > = new Map();

  constructor(private processMessages: (buffer: Array<Message<T>>) => void) {}

  private bulkUpdate = (buffer: Array<Message<T>>) => () =>
    this.processMessages(buffer.splice(0, buffer.length));

  push(message: Message<T>, options: ScheduleOptions) {
    const mode = options.schedule;
    const delay = options.cycleMs || 25;
    const key = `${mode}_${delay}`;

    let obj = this.mBuffer.get(key);
    if (!obj) {
      const buffer = [];
      const fn = !mode
        ? this.bulkUpdate(buffer)
        : (mode == 'debounced' ? debounceFn : throttleFn)(
            this.bulkUpdate(buffer),
            delay,
            {
              leading: false,
              trailing: true,
            },
          );
      obj = { buffer, fn };
      this.mBuffer.set(key, obj);
    }
    obj.buffer.push(message);
    obj.fn();
  }
}
