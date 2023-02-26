export type Listener<L> = (message: L) => void;

export interface EventBus<T, M, L = M> {
  dispatch(type: T, message: M): void;
  subscribe(type: T, listener: Listener<L>): () => void;
}

export class NativeEventBus<M>
  extends EventTarget
  implements EventBus<string, M, CustomEvent<M>>
{
  dispatch(type: string, message: M) {
    if (typeof CustomEvent === 'undefined') return;
    this.dispatchEvent(
      new CustomEvent<M>(type, {
        detail: message,
      }),
    );
  }

  subscribe(type: string, listener: Listener<CustomEvent<M>>): () => void {
    this.addEventListener(type, listener);
    return () => {
      this.removeEventListener(type, listener);
    };
  }
}

export class NodeEventBus<M, T = symbol | string> implements EventBus<T, M> {
  listeners = new Map<T, Listener<M>[]>();
  dispatch(type: T, message: M) {
    const listeners = this.getListeners(type);
    listeners.forEach((listener) => listener(message));
  }
  subscribe(
    type: T,
    listener: (message: M) => void,
  ): () => void {
    const listeners = this.getListeners(type);
    listeners.push(listener);
    return () => {
      const idx = listeners.indexOf(listener);
      if (idx > -1) {
        listeners.splice(idx, 1);
      }
    };
  }

  private getListeners(type: T) {
    let listeners = this.listeners.get(type);
    if (!listeners) {
      listeners = [];
      this.listeners.set(type, listeners);
    }
    return listeners;
  }
}
