import './style.css';
import { AppManager } from './appManager';

let userAction;
do {
    userAction = AppManager.getUserAction();
    AppManager.handleUserAction(userAction);
} while (userAction !== "exit");