import { TagPlugin } from './plugin';
import { TagArguments } from './types';

export function Tagged(...tags: TagArguments): PropertyDecorator {
  return (target, propertyName) => {
    TagPlugin.extend(target.constructor, {
      propertyName,
      tags,
    });
  };
}
