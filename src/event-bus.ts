export class EventBus<T> {
  listeners: any[] = [];
  dispatch = (message: T) => {
    this.listeners.forEach((listener) => {
      setTimeout(() => {
        console.log(message);
        listener(message);
      }, 0);
    });
  };
  listen = (listener: (message: T) => void) => {
    this.listeners.push(listener);
    return () => {
      const idx = this.listeners.indexOf(listener);
      if (idx > -1) {
        this.listeners.splice(idx, 1);
      }
    };
  };
  detach = (listener: any) => {
    const idx = this.listeners.indexOf(listener);
    if (idx > -1) {
      this.listeners.splice(idx, 1);
    }
  };
}
