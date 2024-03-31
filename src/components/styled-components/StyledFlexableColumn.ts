import styled from 'styled-components'

export interface StyledFlexableColumnProps extends FCChildrenProps {
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
export const StyledFlexableColumn = styled.div<StyledFlexableColumnProps>`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.vertical ?? 'stretch'};
  justify-content: ${props => props.vertical ?? 'flex-start'};
  height: 100%;
  .flex-auto {
    flex: auto;
  }
`
