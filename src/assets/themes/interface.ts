import { ThemeConfig } from 'antd';
export declare type ThemeColor = keyof typeof import('./dark.token') & keyof typeof import('./light.token');
export declare type ThemeKey = 'dark' | 'light';
export declare type ThemeData = Partial<Record<ThemeKey, ThemeConfig>>;
export declare type ThemeObject = ThemeData & {
    title?: string;
};
