import './style.css';
import { AppManager } from './appManager';

AppManager.init();

let userAction;
do {
    userAction = AppManager.getUserAction();
    AppManager.handleUserAction(userAction);
} while (userAction !== "exit");