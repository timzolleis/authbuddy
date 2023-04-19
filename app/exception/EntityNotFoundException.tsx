export class EntityNotFoundException extends Error {
  constructor(entity: string) {
    const message = `Entity ${entity} was not found.`
    super(message);
  }
}