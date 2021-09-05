import { makeAutoObservable } from 'mobx';
import { v4 as uuidv4 } from 'uuid';

export interface Block {
    id: string;
    top: number;
    left: number;
    zIndex: number;
    key: string;
    alignCenter?: boolean;
    focus?: boolean;
    width?: number;
    height?: number;
}
class Data {
    container = {
        width: 550,
        height: 550,
    };
    markLine = {
        x: null,
        y: null,
    };
    focus: Block[] = [];
    blocks: Block[] = [
        { top: 100, left: 100, zIndex: 1, key: 'text', id: uuidv4() },
        { top: 200, left: 200, zIndex: 1, key: 'button', id: uuidv4() },
        { top: 300, left: 300, zIndex: 1, key: 'input', id: uuidv4() },
    ];
    /* 获取容易宽高样式 */
    get containerStyles() {
        return { width: `${this.container.width}px`, height: `${this.container.height}px` };
    }
    /* 获取聚焦和非聚焦的block */
    get focusData() {
        const focus: Block[] = [];
        const unfocused: Block[] = [];
        this.blocks.forEach((block) => (block.focus ? focus : unfocused).push(block));
        return { focus, unfocused };
    }
    constructor() {
        makeAutoObservable(this);
    }
    /* 添加block */
    async addBlocks(block: Block) {
        this.blocks.push(block);
    }
    /* 取消blocks 所有的聚焦选中 */
    clearBlockFocus() {
        this.blocks = this.blocks.map((block) => {
            block.focus = false;
            return block;
        });
    }
}
const data = new Data();
export default data;
