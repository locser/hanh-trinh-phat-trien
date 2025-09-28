import { HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { BaseResponse } from '../responses/base.response';

export interface IHttpRequestServiceExceptionResponse {
  is_exception: boolean;
  message: string;
  response?: BaseResponse;
}

@Injectable()
export class HttpRequestService implements OnModuleInit{
  constructor(
    private readonly httpService: HttpService
  ) { }

  onModuleInit() {}

  async getRequest(url: string, params?: any, headers?: any): Promise<any> {
    try {

      // Make the GET request
      const response = await firstValueFrom(this.httpService.get(url, {
        params,
        headers
      }));

      //response.request.res.responseUrl

      return response.data; // Return the data
    } catch (error) {
      console.error('Error fetching data:', error);
      return {
        is_exception: true,
        message: error.message,
        response: new BaseResponse({ status: HttpStatus.BAD_REQUEST, message: error.message })
      }
    }
  }

  async postRequest(url: string, payload?: any, headers?: any): Promise<any> {
    try {
      // Make the POST request
      const response = await firstValueFrom(
        this.httpService.post(url, payload, { headers }),
      );
      return response.data; // Return the response data
    } catch (error) {
      console.error('Error posting data:', error);
      return {
        is_exception: true,
        message: error.message,
        response: new BaseResponse({ status: HttpStatus.BAD_REQUEST, message: error.message })
      }
    }
  }
}
