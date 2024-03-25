import { AliasToken, ComponentTokenMap } from 'antd/es/theme/interface';

export * from './common/component';
const commonInputToken: Partial<AliasToken> = {
    colorBgContainer: '#0f0f0f',
    colorBorder: 'transparent',
};
export const Input: Partial<ComponentTokenMap['Input']> & Partial<AliasToken> = {
    ...commonInputToken,
};
export const Select: Partial<ComponentTokenMap['Select']> & Partial<AliasToken> = {
    ...commonInputToken,
};
