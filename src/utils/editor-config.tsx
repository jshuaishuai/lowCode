import { Button, Input } from 'antd';

const createEditorConfig = () => {
    const componentList: any = [];
    const componentMap: any = {};

    return {
        componentList,
        componentMap,
        register: (component: any) => {
            componentList.push(component);
            componentMap[component.key] = component;
        },
    };
};

const registerConfig = createEditorConfig();

registerConfig.register({
    label: '文本',
    key: 'text',
    preView: () => '预览文本',
    render: () => '渲染文本',
});

registerConfig.register({
    label: '按钮',
    key: 'button',
    preView: () => <Button>预览按钮</Button>,
    render: () => <Button>渲染按钮</Button>,
});

registerConfig.register({
    label: '输入框',
    key: 'input',
    preView: () => <Input placeholder="预览输入框" />,
    render: () => <Input placeholder="渲染输入框" />,
});

export default registerConfig;
