import { Request, Response, NextFunction } from 'express';

export const getClientIp = (req: Request): string => {
    let ip: string = req.ip || 'unknown';

    // если запрос с localhost, то скорее всего это nginx или другой прокси
    if (!ip || ip === '::1' || ip === '127.0.0.1') {
        // x-forwarded-for небезопасен, лучше использовать x-real-ip, но в ТЗ требуется именно он
        const xForwardedFor = req.headers['x-forwarded-for'];
        if (xForwardedFor) {
            const ips = Array.isArray(xForwardedFor)
                ? xForwardedFor
                : xForwardedFor.split(',');
            ip = ips[0].trim(); // берём первый элемент, это оригинальный ip клиента в потенциальной цепочке прокси
        }
    }

    // если обёрнут в ipv6
    return ip.replace(/^::ffff:/, '');
};

export const ipIsLocalhost = (ipAddress?: string): boolean => {
    const isLocalhost = ipAddress === 'unknown' ||
        ipAddress === '::1' ||
        ipAddress === '127.0.0.1' ||
        ipAddress?.startsWith('::ffff:127.0.0.1');
    return isLocalhost || true;
}

export const ipMiddleware = (req: Request, res: Response, next: NextFunction) => {
    req.clientIp = getClientIp(req);
    next();
};