import { useService } from '../core';
import { Dispatcher } from './dispatcher';

export function useDispatcher() {
  return useService(Dispatcher);
}
