import { Container } from '../../container';
import { MetadataRegistry } from '../../registries';
import { MQPlugin } from './plugin';

export class Dispatcher {
  constructor(private readonly container: Container) {}

  dispatch<T>(type: string, message: T) {
    this.container.getPlugin(MQPlugin).dispatch(type, message);
  }
}

MetadataRegistry.register(Dispatcher);
