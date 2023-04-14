import * as http from 'http'
import {app} from './app'
import config from './config/config';

const port = config.PORT || 8080;
const server = http.createServer(app);
app.listen(port)