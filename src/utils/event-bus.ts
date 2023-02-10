export interface EventBus<T> {
  dispatch(type: string, message: T): void;
  subscribe(
    type: string,
    listener: (message: CustomEvent<T>) => void,
  ): () => void;
}

export class NativeEventBus<T> extends EventTarget implements EventBus<T> {
  dispatch(type: string, message: T) {
    this.dispatchEvent(
      new CustomEvent<T>(type, {
        detail: message,
      }),
    );
  }

  subscribe(
    type: string,
    listener: (message: CustomEvent<T>) => void,
  ): () => void {
    this.addEventListener(type, listener);
    return () => {
      this.removeEventListener(type, listener);
    };
  }
}
