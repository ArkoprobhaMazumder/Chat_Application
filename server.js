import { server } from './index.js';
import connectDatabase from './src/config/database.config.js';


// start the server
server.listen(3500, () => {
    console.log("Server Running");
    connectDatabase();
})