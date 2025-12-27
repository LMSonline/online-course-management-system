export class AppError extends Error {
  status: number;
  code: string;
  contractKey?: string;

  constructor(message: string, status: number, code: string, contractKey?: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.contractKey = contractKey;
  }
}
