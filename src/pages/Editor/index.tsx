import { useRef } from 'react';
import { Button } from 'antd';
import { data, config } from '@/store';
import EditorBlock from './EditorBlock';
import useMenuDrag from './useMenuDragger';
import { useLocalObservable, Observer } from 'mobx-react-lite';
import useCommand from './useCommand';
import './style.less';

const Editor = () => {
    const localData = useLocalObservable(() => data);
    const localConfig = useLocalObservable(() => config);

    const containerRef = useRef<HTMLDivElement | null>(null);
    // 1.实现左侧菜单栏的拖拽功能
    const { dragstart, dragend } = useMenuDrag(containerRef, localData);

    /* 点击容器让选中的失去焦点 */
    const containerMouseDown = () => {
        localData.clearBlockFocus();
    };
    const { command } = useCommand(localData);
    console.log(command);

    const buttons = [
        {
            label: '撤销',
            handler: () => {
                if (command.undo) command.undo();
            },
        },
        {
            label: '重做',
            handler: () => {
                if (command.redo) command.redo();
            },
        },
    ];

    return (
        <Observer>
            {() => (
                <div className="editor">
                    <div className="editor_left">
                        {/* 根据注册列表 渲染对应的内容 可以实现 h5 拖拽 */}
                        {localConfig.config.componentList.map((component: any) => (
                            <div
                                className="editor_left_item"
                                key={component.key}
                                draggable
                                onDragStart={(e) => dragstart(e, component)}
                                onDragEnd={dragend}
                            >
                                <span>{component.label}</span>
                                <div>{component.preView()}</div>
                            </div>
                        ))}
                    </div>
                    {/* 撤销 重做  图层置顶 导入jsonScheme 导导出jsonScheme */}
                    <div className="editor_top">
                        {buttons.map((btn, index) => (
                            <div className="editor_top_button" onClick={btn.handler} key={index}>
                                <Button type="primary">{btn.label}</Button>
                            </div>
                        ))}
                    </div>
                    <div className="editor_right">属性控制栏</div>
                    <div className="editor_container">
                        {/* 负责产生滚动条 */}
                        <div className="editor_container_canvas">
                            {/* 产生内容区 */}
                            <div
                                className="editor_container_canvas_content"
                                style={localData.containerStyles}
                                ref={containerRef}
                                onMouseDown={containerMouseDown}
                            >
                                {localData.blocks.map((block, index: number) => (
                                    <EditorBlock key={block.id} block={block} index={index} />
                                ))}
                                {/* 感应线 */}
                                {localData.markLine.x !== null && (
                                    <div
                                        className="line-x"
                                        style={{ left: `${localData.markLine.x}px` }}
                                    />
                                )}
                                {localData.markLine.y !== null && (
                                    <div
                                        className="line-y"
                                        style={{ top: `${localData.markLine.y}px` }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Observer>
    );
};
export default Editor;
