import morgan from 'morgan';

const logger = morgan(':date[iso] :remote-addr :method :url :status :response-time ms');

export default logger;