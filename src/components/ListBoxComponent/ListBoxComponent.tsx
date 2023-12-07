import { forwardRef } from 'react'
import { VariableSizeList } from 'react-window'
import renderRow from './renderRow'

import { ITEM_SIZE, LISTBOX_PADDING } from './constants'

const ListBoxComponent = forwardRef((props: any, ref: any) => {
  const { children, ...other } = props
  const itemData: any = []
  children.forEach((item: any) => {
    itemData.push(item)
    itemData.push(...(item.children || []))
  })

  const itemCount = itemData.length

  const getChildSize = () => {
    return ITEM_SIZE
  }

  const getHeight = () => {
    if (itemCount > 3) {
      return 3 * ITEM_SIZE
    }
    return itemData.map(getChildSize).reduce((a: number, b: number) => a + b, 0)
  }

  return (
    <div ref={ref} {...other}>
      <VariableSizeList
        itemData={itemData}
        itemCount={itemData.length}
        itemSize={getChildSize}
        innerElementType="ul"
        height={getHeight() + 2 * LISTBOX_PADDING}
        width="100%">
        {renderRow}
      </VariableSizeList>
    </div>
  )
})

export default ListBoxComponent
