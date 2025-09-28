import * as moment from 'moment';

export function formatCreatedAtTime(time: string) {
	return time ? moment(time, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm') : '';
}
