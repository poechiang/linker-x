export const toUnder = (name: string) => {
  if (typeof name !== 'string') {
    throw Error('无效的参数,参数类型无效,或为空')
  }
  return name.replace(/[A-Z]/g, (l, i) => (i ? '-' : '') + l.toLowerCase())
}
