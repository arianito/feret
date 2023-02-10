import { Container } from '../../container';

export class BaseService {
  constructor(protected readonly container: Container) {}
}