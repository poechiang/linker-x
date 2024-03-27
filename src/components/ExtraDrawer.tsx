import {
  CloseOutline,
  PinFill,
  PinOutline,
  ToLeftOutline,
  ToRightOutline,
} from '@assets/icons'
import { TitleBarButton } from '@components/TitleBar'
import { Drawer, theme } from 'antd'
import { FC, useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

export type ExtraDrawerProps = FCChildrenProps & {
  placement?: 'left' | 'top' | 'right' | 'bottom'

  defaultVisible?: boolean
  defaultExpanded?: boolean
  defaultPinned?: boolean
  expanded?: boolean
  pinned?: boolean
  closeable?: boolean
  visible?: boolean
  onClose?: () => void
  onExpandedChange?: (expanded: boolean) => void
  onPinnedChange?: (pinned: boolean) => void
}
const StyledDrawer = styled.div<ExtraDrawerProps>`
  .lnk-drawer-content-wrapper {
    width: ${props => (props.expanded ? 100 : 50)}% !important;
    .lnk-drawer-header {
      border-bottom: none;
      padding: 8px 16px;
    }
  }
`

const ExtraDrawer: FC<ExtraDrawerProps> = ({
  visible: visibleProps,
  expanded: expandedProps,
  pinned: pinnedProps,
  ...props
}) => {
  const { token } = theme.useToken()
  const [visible, setVisible] = useState(visibleProps ?? props.defaultVisible)
  const [pinned, setPinned] = useState(pinnedProps ?? props.defaultPinned)
  const [expanded, setExpanded] = useState(
    visibleProps ?? props.defaultExpanded
  )
  const handleCloseButtonClick = useCallback(() => {
    setVisible(false)
    props?.onClose?.()
  }, [])
  const handleExpandedButtonClick = useCallback(() => {
    const value = !expanded
    props.onExpandedChange?.(value)
    setExpanded(value)
  }, [expanded])
  const handlePinnedButtonClick = useCallback(() => {
    const value = !pinned
    props.onPinnedChange?.(value)
    setPinned(value)
  }, [pinned])

  useEffect(() => {
    pinnedProps !== undefined && setPinned(pinnedProps)
  }, [pinnedProps])
  useEffect(() => {
    expandedProps !== undefined && setExpanded(expandedProps)
  }, [expandedProps])
  useEffect(() => {
    visibleProps !== undefined && setVisible(visibleProps)
  }, [visibleProps])
  return (
    <StyledDrawer expanded={expanded}>
      <Drawer
        title={
          <>
            {props.closeable !== false ? (
              <TitleBarButton
                type="text"
                className="non-draggable"
                token={token}
                onClick={handleCloseButtonClick}
              >
                <CloseOutline />
              </TitleBarButton>
            ) : null}
            <TitleBarButton
              type="text"
              className="non-draggable ml-8"
              token={token}
              onClick={handlePinnedButtonClick}
              checked={pinned}
            >
              {pinned ? (
                <PinFill style={{ color: token.colorError }} />
              ) : (
                <PinOutline />
              )}
            </TitleBarButton>

            <TitleBarButton
              type="text"
              className="non-draggable ml-8"
              token={token}
              onClick={handleExpandedButtonClick}
            >
              {expanded ? <ToRightOutline /> : <ToLeftOutline />}
            </TitleBarButton>
          </>
        }
        closable={false}
        maskClosable={!pinned}
        onClose={handleCloseButtonClick}
        open={visible}
        getContainer={false}
        placement="right"
        {...props}
      >
        {props?.children}
      </Drawer>
    </StyledDrawer>
  )
}
export const routeMeta = void 0
export default ExtraDrawer
