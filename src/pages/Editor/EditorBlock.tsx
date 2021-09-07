import type { FC } from 'react';
import { config, data } from '@/store';
import { useEffect, useRef } from 'react';
import { useLocalObservable, observer } from 'mobx-react-lite';
import classNames from 'classnames/bind';
import useBlockDragger from './useBlockDragger';

interface Props {
    block: Record<string, any>;
    index: number;
}
const EditorBlock: FC<Props> = (props) => {
    const { block, index } = props;
    const blockRef = useRef<HTMLDivElement>(null);
    const localData = useLocalObservable(() => data);
    const localConfig = useLocalObservable(() => config);
    const blockStyles = {
        top: `${block.top}px`,
        left: `${block.left}px`,
        zIndex: block.zIndex,
    };
    // 最后选择的那一个
    const lastSelectBlock = localData.blocks[index];

    useEffect(() => {
        if (!blockRef.current) return;
        const { offsetWidth, offsetHeight } = blockRef.current;
        if (block.alignCenter) {
            block.left -= offsetWidth / 2;
            block.top -= offsetHeight / 2;
            block.alignCenter = false;
        }
        block.width = offsetWidth;
        block.height = offsetHeight;
    }, [block]);
    // 3. 实现组件拖拽
    const { mouseDown } = useBlockDragger(localData, lastSelectBlock);
    // 2. 实现获取焦点 选中后可能直接就进行拖拽了
    const blockMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        // block上规划一个属性 focus 获取焦点后就将focus变为true
        if (e.shiftKey) {
            if (localData.focusData.focus.length <= 1) {
                block.focus = true;
            } else {
                block.focus = !block.focus;
            }
        } else if (!block.focus) {
            localData.clearBlockFocus(); // 让其他组件失去焦点
            block.focus = true; // 让当前组件获取焦点
        }
        /* 获取焦点后进行拖拽 */
        mouseDown(e);
    };
    // console.log(localData.blocks);

    const component = localConfig.config.componentMap[block.key];
    const renderComponent = component.render();
    return (
        <div
            ref={blockRef}
            className={classNames('editor_block', { editor_block_focus: block.focus })}
            style={blockStyles}
            onMouseDown={blockMouseDown}
        >
            {/* {console.log(blockStyles, block)} */}
            {renderComponent}
        </div>
    );
};

export default observer(EditorBlock);
