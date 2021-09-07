import { v4 as uuidv4 } from 'uuid';
import { events } from './events';

const useMenuDrag = (containerRef: any, localData: any) => {
    let currentComponent: any = null;
    const dragenter = (e: any) => {
        e.dataTransfer.dropEffect = 'move';
    };

    const dragover = (e: any) => {
        e.preventDefault();
    };
    const dragleave = (e: any) => {
        e.dataTransfer.dropEffect = 'none';
    };
    const drop = (e: any) => {
        const block = {
            id: uuidv4(),
            left: e.offsetX,
            top: e.offsetY,
            zIndex: 1,
            key: currentComponent.key,
            alignCenter: true,
        };
        localData.addBlocks(block);
    };
    const dragstart = (e: any, component: any) => {
        // dragenter 进入元素中，添加一个移动的标识
        // dragover 在目标元素经过必须要组织默认行为 否则不能触发drop
        // dragleave 离开元素的时候需要增加一个禁用标识
        // drop 松手的时候根据拖拽的组件，添加一个组件
        if (!containerRef.current) return;
        containerRef.current.addEventListener('dragenter', dragenter);
        containerRef.current.addEventListener('dragover', dragover);
        containerRef.current.addEventListener('dragleave', dragleave);
        containerRef.current.addEventListener('drop', drop);
        currentComponent = component;
        events.emit('start'); // 发布start
    };

    const dragend = () => {
        if (!containerRef.current) return;
        containerRef.current.removeEventListener('dragenter', dragenter);
        containerRef.current.removeEventListener('dragover', dragover);
        containerRef.current.removeEventListener('dragleave', dragleave);
        containerRef.current.removeEventListener('drop', drop);
        currentComponent = null;
        events.emit('end'); // 发布end
    };

    return {
        dragstart,
        dragend,
    };
};

export default useMenuDrag;
