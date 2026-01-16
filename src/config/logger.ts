import winston from 'winston';

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.align(),
                winston.format.printf(info => `${info.timestamp} [${info.level}]: ${info.message}`)
            )
        }),
        new winston.transports.File({ 
            filename: 'test-results/Logs/logs.log',
            format: winston.format.combine(
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.align(),
                winston.format.printf(info => `${info.timestamp} [${info.level}]: ${info.message}`)
            )
        }), 
    ],
});

const TEST_SEPARATOR = '#################################################################################';

export default class Log {
    public static testBegin(test: string) {
        logger.info(TEST_SEPARATOR);
        logger.info(`${test} - Started`);
    }

    public static testEnd(test: string) {
        logger.info(`${test} - Ended`);
        logger.info(TEST_SEPARATOR);
    }   

    public static info(message: string) {
        logger.info(message);
    }   

    public static error(message: string) {;
        logger.error(message);
    }
}