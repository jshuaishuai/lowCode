import { makeAutoObservable } from 'mobx';
import registerConfig from '@/utils/editor-config';

class Config {
    config = registerConfig;
    constructor() {
        makeAutoObservable(this);
    }
}
const config = new Config();
export default config;
