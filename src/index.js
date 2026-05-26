import './style.css';
import { collectionManager } from './collectionManager';
import { domManager } from './domManager';
import { storageManager } from './storageManager';

if (storageManager.get("default") === null) {
    storageManager.save("default", []);
}
collectionManager.loadCollection();
domManager.init();