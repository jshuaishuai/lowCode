import { events } from './events';
import { cloneDeep } from 'lodash-es';
import { useEffect } from 'react';
import type { Block } from '@/store/data';

interface Command {
    redo?: () => void | undefined;
    undo?: () => void | undefined;
    drag?: () => void | undefined;
}
interface RegistryCommand {
    name: string;
    keyboard?: string;
    pushQueue?: boolean;
    execute: () => Command;
    init?: () => () => void;
    before?: Block[] | null;
}
type State = {
    queue: { redo?: () => void; undo?: () => void }[];
    current: number;
    command: Command;
    commandArray: RegistryCommand[];
    destroyArray: (() => void)[];
};

const useCommand = (localData: any) => {
    const state: State = {
        queue: [], // 存放执行命令
        current: -1, // 控制队列前进后退的指针
        command: {}, // 制作命令和执行功能一个映射表  undo : ()=>{}  redo:()=>{} drag:()=>{}
        commandArray: [],
        destroyArray: [], // 发布订阅结束后销毁start和end 事件
    };
    /* 注册命令的方法 */
    const registry = (registryCommand: RegistryCommand) => {
        state.commandArray.push(registryCommand);
        // @ts-ignore
        state.command[registryCommand.name] = () => {
            // 命令名字对应执行函数
            const { redo, undo } = registryCommand.execute();
            if (redo) redo();
            if (!registryCommand.pushQueue) {
                // 不需要放到队列中直接跳过即可
                return;
            }
            let { queue } = state;
            const { current } = state;
            // 如果先放了 组件1 -》 组件2 => 组件3 =》 组件4 - -》 组件3
            // 组件1 -> 组件3
            if (queue.length > 0) {
                queue = queue.slice(0, current + 1); // 可能在放置的过程中有撤销操作，所以根据当前最新的current值来计算新的对了
                state.queue = queue;
            }
            queue.push({ redo, undo }); // 保存指令的前进后退
            state.current = current + 1;
            // console.log(queue);
        };
    };
    registry({
        name: 'redo',
        keyboard: 'ctrl+y',
        execute() {
            return {
                redo() {
                    const item = state.queue[state.current + 1]; // 找到当前的下一步还原操作
                    if (item && item.redo) {
                        item.redo();
                        state.current += 1;
                    }
                },
            };
        },
    });

    registry({
        name: 'undo',
        keyboard: 'ctrl+z',
        execute() {
            return {
                redo() {
                    if (state.current == -1) return; // 没有可以撤销的了
                    const item = state.queue[state.current]; // 找到上一步还原
                    if (item && item.undo) {
                        item.undo(); // 这里没有操作队列
                        state.current -= 1;
                    }
                },
            };
        },
    });

    registry({
        name: 'drag',
        pushQueue: true,
        init() {
            // 初始化操作默认就会执行
            this.before = null;
            // 监控拖拽开始事件，保存状态

            const start = () => {
                console.log('start');

                this.before = cloneDeep(localData.blocks);
            };
            // 拖拽之后需要触发对应的指令
            const end = () => {
                // @ts-ignore
                state.command.drag();
            };

            events.on('start', start); // 订阅事件
            events.on('end', end); // 订阅事件
            return () => {
                events.off('start', start);
                events.off('end', end);
            };
        },
        execute() {
            const { before } = this;
            const after = cloneDeep(localData.blocks);
            return {
                redo: () => {
                    // console.log('重做', after);
                    localData.blocks = after;
                },
                undo() {
                    // console.log('撤销', before);
                    localData.blocks = before;
                },
            };
        },
    });
    (() => {
        state.commandArray.forEach(
            (registryCommand) =>
                registryCommand.init && state.destroyArray.push(registryCommand.init()),
        );
    })();
    useEffect(() => {
        () => state.destroyArray.forEach((fn) => fn && fn());
    });
    return state;
};

export default useCommand;
