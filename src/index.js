import './style.css';
import { AppController } from './appController';

let userAction;
do {
    userAction = AppController.getUserAction();
    AppController.handleUserAction(userAction);
} while (userAction !== "exit");