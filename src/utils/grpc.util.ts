import { HttpException, HttpStatus } from '@nestjs/common';
import { firstValueFrom, Observable } from 'rxjs';

export async function callGrpcClient<T>(observable: Observable<{ status: number; message: string; data: T }>) {
  const res = await firstValueFrom(observable);
  if (res.status != HttpStatus.OK) throw new HttpException(res.message, res.status);

  return res.data;
}
