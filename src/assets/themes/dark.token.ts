import { AliasToken } from 'antd/es/theme/interface';

const commonToken: Partial<AliasToken> = {
    colorTextBase: '#ffffff',
    colorBgBase: '#000000',
    colorBgContainer: '#141414',
};
const cyan: Partial<AliasToken> = {
    ...commonToken,
    colorPrimary: '#13a8a8',
};
const daybreak: Partial<AliasToken> = {
    ...commonToken,
    colorPrimary: '#1668dc',
};
const dust: Partial<AliasToken> = {
    ...commonToken,
    colorPrimary: '#d32029',
};
const polar: Partial<AliasToken> = {
    ...commonToken,
    colorPrimary: '#49aa19',
};
const purple: Partial<AliasToken> = {
    ...commonToken,
    colorPrimary: '#642ab5',
};
export { cyan, daybreak, dust, polar, purple };
