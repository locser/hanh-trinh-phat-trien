import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class UserIdentificationMiddleware implements NestMiddleware {
	use(req: Request, res: Response, next: NextFunction) {
		// Skip middleware for public routes, root API, Swagger docs, and auth endpoints
		if (
			req.path.startsWith('/api/public') ||
			req.path === '/api' ||
			req.path === '/api/' ||
			req.path.startsWith('/api/docs') ||
			req.path.startsWith('/api/v1/auth')
		) {
			next();
			return;
		}

		// Check for required header: X-User-Session
		const userSession = req.headers['x-user-session'] as string;

		if (!userSession) {
			throw new BadRequestException({
				error: 'Missing required header',
				message: 'X-User-Session header is required for user identification',
				statusCode: 400,
			});
		}

		// Validate user session format (should be a UUID-like string or browser fingerprint)
		if (!this.isValidUserSession(userSession)) {
			throw new BadRequestException({
				error: 'Invalid user session',
				message: 'X-User-Session header must be a valid session identifier',
				statusCode: 400,
			});
		}

		// Add user session to request object
		req['userSession'] = userSession;

		// Also get user agent for additional identification
		const userAgent = req.headers['user-agent'] || 'Unknown';
		req['userAgent'] = userAgent;

		next();
	}

	private isValidUserSession(session: string): boolean {
		// Check if session is not empty and has reasonable length
		if (!session || session.length < 10 || session.length > 255) {
			return false;
		}

		// Allow alphanumeric characters, hyphens, and underscores
		const validSessionRegex = /^[a-zA-Z0-9\-_\.]+$/;
		return validSessionRegex.test(session);
	}
}
