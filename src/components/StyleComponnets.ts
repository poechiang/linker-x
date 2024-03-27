import styled from 'styled-components'

export const StyledFlexableRow = styled.div<{ height?: string }>`
  display: flex;
  align-items: stretch;
  height: ${props => props.height};
  .flex-auto {
    flex: auto;
  }
`
