import * as moment from 'moment-timezone';

export abstract class TimeHelper {
  static formatTimeDMYHms(inp: moment.MomentInput): string {
    const time = moment(inp, true);
    return time.isValid() ? time.format('DD/MM/YYYY HH:mm:ss') : '';
  }

  static formatTimeDMYHm(inp: moment.MomentInput): string {
    const time = moment(inp, true);
    return time.isValid() ? time.format('DD/MM/YYYY HH:mm') : '01/01/1970 00:00';
  }

  static formatTimeDMY(inp: moment.MomentInput, format?: string, defaultValue?: string): string {
    const time = moment(inp, format, true);
    return time.isValid() ? time.format('DD/MM/YYYY') : (defaultValue ?? '');
  }

  static formatTimeYMDHm(inp: moment.MomentInput): string {
    const time = moment(inp, true);
    return time.isValid() ? time.format('YYYY/MM/DD HH:mm') : '1970/01/01 00:00';
  }

  static formatTimeYMD(inp: moment.MomentInput): string {
    const time = moment(inp, true);
    return time.isValid() ? time.format('YYYY/MM/DD') : '1970/01/01';
  }

  static formatTimeHm(inp: moment.MomentInput): string {
    const time = moment(inp, true);
    return time.isValid() ? time.format('HH:mm') : '00:00';
  }

  static formatDMYHmToYMDHm(inp: moment.MomentInput): string {
    const time = moment(inp, 'DD/MM/YYYY HH:mm', true);
    return time.isValid() ? time.format('YYYY-MM-DD HH:mm') : '';
  }

  static formatDMYToYMD(inp: moment.MomentInput): string {
    const time = moment(inp, 'DD/MM/YYYY', true);
    return time.isValid() ? time.format('YYYY-MM-DD') : '';
  }

  static isValidTimeFormat(inp: moment.MomentInput, format: string): boolean {
    const time = moment(inp, format, true);
    return time.isValid();
  }

  static formatDMYHmsToTimestamp(inp: moment.MomentInput): number {
    const time = moment(inp, true);
    return time.isValid() ? moment(inp, 'YYYY-MM-DD HH:mm:ss').valueOf() : moment().valueOf();
  }

  /**
   * 
   * @param from_date 
   * @param to_date 
   * @returns [from_date, to_date]
   */
  static fromDateToDateFormat(from_date: string, to_date: string): [string, string] {
    const fromDate = from_date
      ? moment(from_date, 'DD/MM/YYYY').startOf('days').format('YYYY-MM-DD HH:mm:ss')
      : '1970-01-01 00:00:00';

    const toDate = to_date
      ? moment(to_date, 'DD/MM/YYYY').endOf('days').format('YYYY-MM-DD HH:mm:ss')
      : moment().endOf('days').format('YYYY-MM-DD HH:mm:ss');

    return [fromDate, toDate]; // Return an array of strings as the resul
  }

}
