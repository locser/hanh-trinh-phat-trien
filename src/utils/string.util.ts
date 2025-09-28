export abstract class StringUtil {
  static normalizedString(str: string) {
    if (!str) return str;

    str = str.toLowerCase();
    str = str.trim();

    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');

    return str;
  }

  static extractAddressInfoFromString(data: string, type: "id" | "text"): any {
    if (!data) return type == "id" ? 0 : '';
    const [id, address] = data.split("|");
    return type == "id" ? id : address;
  }

  static formatMoneyVN(amount: any) {
    if (isNaN(amount)) return 'NaN';
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    }).format(amount);
  }

  static convertPhoneNumber(phone: string) {
    let phoneFormatted = phone;
    if(!phoneFormatted) return '';
    if (String(phone).startsWith("+84")) phoneFormatted = phone.replace("+84", '0');
    if (String(phone).startsWith("84")) phoneFormatted =  '0' + phoneFormatted.slice(2);
    
    return phoneFormatted.replaceAll(/[^a-zA-Z0-9 ]|\(|\)/g, "");
  }
 
  static parseString<T>(data: any): T {
    try {
      return (typeof data === 'string' ? JSON.parse(data) : data) as T;
    } catch (error) {
      console.log(`[DEBUG StringUtil parseString ERROR]: ${error.message} | ${JSON.stringify(data)}`);
      return {} as T;
    }
  }

  static stringifyData(data: any){
    if(typeof data === 'string') return data;
    return JSON.stringify(data);
  } 


}
