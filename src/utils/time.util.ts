import * as moment from 'moment-timezone';

export abstract class TimeHelper {
	/**
	 *
	 * @param from_date
	 * @param to_date
	 * @returns [from_date, to_date]
	 */
	static fromDateToDateFormat(from_date: string, to_date: string): [string, string] {
		const fromDate = from_date ? moment(from_date, 'DD/MM/YYYY').startOf('days').format('YYYY-MM-DD HH:mm:ss') : '1970-01-01 00:00:00';

		const toDate = to_date
			? moment(to_date, 'DD/MM/YYYY').endOf('days').format('YYYY-MM-DD HH:mm:ss')
			: moment().endOf('days').format('YYYY-MM-DD HH:mm:ss');

		return [fromDate, toDate]; // Return an array of strings as the resul
	}
}
