export class ReflectionNotAvailableError extends Error {
  get message() {
    return 'Reflection is not available';
  }
}

export class ReflectMetadataUnavailableError extends Error {
  get message() {
    return 'Please install reflect-metadata and import it at root of the project.';
  }
}
