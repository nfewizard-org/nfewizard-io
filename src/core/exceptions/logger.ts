import winston from 'winston';

export const logger = winston.createLogger({
  level: 'error', // Apenas logs de erro
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(), // Mostra logs no console
    new winston.transports.File({ filename: 'tmp/logs/errors.json' }) // Salva logs em um arquivo
  ],
});


// import winston from 'winston';
// import path from 'path';

// export const logger = winston.createLogger({
//   level: 'error', // Apenas logs de erro
//   format: winston.format.combine(
//     winston.format.timestamp(),
//     winston.format.printf(({ timestamp, level, message, ...meta }) => {
//       return `[${timestamp}] [${level.toUpperCase()}] ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
//     })
//   ),
//   transports: [
//     new winston.transports.Console(), // Mostra logs no console
//     new winston.transports.File({ 
//       filename: 'errors.log', 
//       level: 'error' 
//     }) // Salva logs em um arquivo
//   ],
// });
