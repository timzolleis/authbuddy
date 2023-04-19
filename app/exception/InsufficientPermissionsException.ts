export class InsufficientPermissionsException extends Error {
  constructor( requiredPermission: string) {
    const message = `You do not have the required permission to perform this action. You require ${requiredPermission}`
    super(message);
  }
}