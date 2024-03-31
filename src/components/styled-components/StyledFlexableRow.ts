import styled from 'styled-components'

export interface StyledFlexableRowProps extends FCChildrenProps {
  height?: string
  vertical?: 'center' | 'flex-start' | 'flex-end' | 'baseline' | 'stretch'
  horizontal?:
    | 'center'
    | 'flex-start'
    | 'flex-end'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
}
export const StyledFlexableRow = styled.div<StyledFlexableRowProps>`
  display: flex;
  align-items: ${props => props.vertical ?? 'stretch'};
  justify-content: ${props => props.vertical ?? 'flex-start'};
  height: ${props => props.height};
  .flex-auto {
    flex: auto;
  }
`
