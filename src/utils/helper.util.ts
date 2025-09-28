import * as crypto from 'crypto';

interface DiscountResult {
    originalTotal: number;
    discountPercent: number;
    discountAmount: number;
    finalTotal: number;
  }

export class HelperUtil {
    
    static appendParamsToUrl(baseUrl: string, params: Record<string, any> = {}): string {
        const url = new URL(baseUrl);

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.set(key, String(value));
            }
        });

        return url.toString();
    }

    static generateJwtSecret(){
      return crypto.randomBytes(32).toString('hex');
    }

}