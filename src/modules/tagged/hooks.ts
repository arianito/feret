import { useService } from '../core';
import { TagManager } from './tag-manager';

export function useTagManager() {
  return useService(TagManager);
}
