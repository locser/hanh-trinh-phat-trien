import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class IpDetectionMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Get real IP address from various headers
    const ip = this.getRealIpAddress(req);
    
    // Add IP to request object
    req['clientIp'] = ip;
    
    next();
  }

  private getRealIpAddress(req: Request): string {
    // Priority order for IP detection
    const ipSources = [
      req.headers['cf-connecting-ip'], // Cloudflare
      req.headers['x-real-ip'], // Nginx proxy
      req.headers['x-forwarded-for'], // Standard proxy header
      req.headers['x-client-ip'], // Apache mod_proxy
      req.headers['x-cluster-client-ip'], // Cluster
      req.connection?.remoteAddress,
      req.socket?.remoteAddress,
      req.ip,
    ];

    for (const ipSource of ipSources) {
      if (ipSource) {
        let ip = Array.isArray(ipSource) ? ipSource[0] : ipSource.toString();
        
        // Handle comma-separated IPs (x-forwarded-for can have multiple IPs)
        if (ip.includes(',')) {
          ip = ip.split(',')[0].trim();
        }
        
        // Validate IP format
        if (this.isValidIp(ip)) {
          return ip;
        }
      }
    }

    // Fallback to localhost if no valid IP found
    return '127.0.0.1';
  }

  private isValidIp(ip: string): boolean {
    // Basic IP validation (IPv4 and IPv6)
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    
    return ipv4Regex.test(ip) || ipv6Regex.test(ip) || ip === '::1';
  }
}