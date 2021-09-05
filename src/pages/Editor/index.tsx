import { useRef } from 'react';
import { data, config } from '@/store';
import EditorBlock from './EditorBlock';
import useMenuDrag from './useMenuDragger';
import { useLocalObservable, Observer } from 'mobx-react-lite';
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
                    <div className="editor_top">菜单栏</div>
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
                                    <EditorBlock
                                        key={block.id}
                                        focus={block.focus}
                                        block={block}
                                        index={index}
                                        // onMouseDown={(e) => blockMouseDown(e, block)}
                                    />
                                ))}
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
