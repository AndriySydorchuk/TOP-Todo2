import './style.css';
import { AppManager } from './appManager';
import { collectionManager } from './collectionManager';

AppManager.init();
collectionManager.init();

let userAction;
do {
    userAction = AppManager.getUserAction();
    AppManager.handleUserAction(userAction);
} while (userAction !== "exit");