import { config } from 'dotenv';
import { Application } from './application';
config();

const app = new Application();
app.loadBuiltins().then(() => {
    app.start();
});
