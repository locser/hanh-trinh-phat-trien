import { Injectable } from '@nestjs/common';

@Injectable()
export class RateLimiterUtil {
	/**
	 * Check if IP has exceeded daily submission limit
	 */
	static hasExceededDailyLimit(submissionCount: number, maxPerDay: number = 2): boolean {
		return submissionCount >= maxPerDay;
	}

	/**
	 * Get time until midnight in seconds
	 */
	static getTimeUntilMidnight(): number {
		const now = new Date();
		const midnight = new Date();
		midnight.setHours(24, 0, 0, 0);

		return Math.ceil((midnight.getTime() - now.getTime()) / 1000);
	}

	/**
	 * Get start and end of current day
	 */
	static getCurrentDayRange(): { start: Date; end: Date } {
		const start = new Date();
		start.setHours(0, 0, 0, 0);

		const end = new Date(start);
		end.setDate(end.getDate() + 1);

		return { start, end };
	}

	/**
	 * Generate rate limit error message
	 */
	static getRateLimitErrorMessage(maxPerDay: number): string {
		return `You have exceeded the daily submission limit (${maxPerDay} submissions per day). Please try again tomorrow.`;
	}
}
