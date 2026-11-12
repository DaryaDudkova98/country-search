export class HttpError extends Error {
  status: number;
  
  constructor(status: number) {
    super('not implemented');
    this.status = status;
    throw new Error('not implemented');
  }
}