import { ObservablePlugin } from "./plugin";


export function Observable(): PropertyDecorator {
  return (target, propertyName) => {
    ObservablePlugin.extend(target.constructor, propertyName);
  };
}
