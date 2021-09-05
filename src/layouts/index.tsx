import type { FC, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

const Layouts: FC<Props> = (props) => {
    return <>{props.children}</>;
};

export default Layouts;
