import { AliasToken } from 'antd/es/theme/interface'

const commonToken: Partial<AliasToken> = {
  colorBgLayout: '#f0f0f0',
  colorBgContainer: '#f8f8f8',
}
const cyan: Partial<AliasToken> = {
  ...commonToken,
  colorPrimary: '#13c2c2',
}
const daybreak: Partial<AliasToken> = {
  ...commonToken,
  colorPrimary: '#1677ff',
}
const dust: Partial<AliasToken> = {
  ...commonToken,
  colorPrimary: '#f5222d',
}
const polar: Partial<AliasToken> = {
  ...commonToken,
  colorPrimary: '#52c41a',
}
const purple: Partial<AliasToken> = {
  ...commonToken,
  colorPrimary: '#722ed1',
}

export { cyan, daybreak, dust, polar, purple }
