export interface LogPayload {
  requestId?: string;
  endpoint?: string;
  method?: string;
  status?: number;
  latencyMs?: number;
  errorCode?: string;
  message: string;
  [key: string]: any;
}

const sanitize = (data: any): any => {
  if (!data || typeof data !== 'object') return data;
  const clean = { ...data };
  const sensitiveKeys = ['password', 'passwordHash', 'token', 'authorization', 'secret', 'apiKey', 'creditCard'];
  for (const key of Object.keys(clean)) {
    if (sensitiveKeys.some(s => key.toLowerCase().includes(s.toLowerCase()))) {
      clean[key] = '[REDACTED]';
    } else if (typeof clean[key] === 'object') {
      clean[key] = sanitize(clean[key]);
    }
  }
  return clean;
};

export const logger = {
  info: (message: string, meta?: Partial<LogPayload>) => {
    console.log(JSON.stringify({ level: 'INFO', timestamp: new Date().toISOString(), message, ...sanitize(meta) }));
  },
  warn: (message: string, meta?: Partial<LogPayload>) => {
    console.warn(JSON.stringify({ level: 'WARN', timestamp: new Date().toISOString(), message, ...sanitize(meta) }));
  },
  error: (message: string, meta?: Partial<LogPayload>) => {
    console.error(JSON.stringify({ level: 'ERROR', timestamp: new Date().toISOString(), message, ...sanitize(meta) }));
  },
  debug: (message: string, meta?: Partial<LogPayload>) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(JSON.stringify({ level: 'DEBUG', timestamp: new Date().toISOString(), message, ...sanitize(meta) }));
    }
  }
};
