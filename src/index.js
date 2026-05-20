import './style.css';
import { AppManager } from './appManager';
import { collectionManager } from './collectionManager';
import { domManager } from './domManager';

AppManager.init();
collectionManager.init();
domManager.init();

// let userAction;
// do {
//     userAction = AppManager.getUserAction();
//     AppManager.handleUserAction(userAction);
// } while (userAction !== "exit");