import { ListChildComponentProps } from 'react-window'
import { LISTBOX_PADDING } from './constants'
import { Box } from '@mui/material'

const renderRow = ({ index, data, style }: ListChildComponentProps): JSX.Element => {
  const dataSet = data[index]
  const option = dataSet[1]

  const inlineStyle = {
    ...style,
    top: (style.top as number) + LISTBOX_PADDING
  }

  return (
    <Box
      key={option.ticker}
      component="li"
      sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
      style={inlineStyle}
      {...dataSet[0]}>
      {option.ticker !== 'No options' && (
        <img
          className="svg-image"
          loading="lazy"
          width="20"
          srcSet={option.image}
          src={option.image}
          alt={option.ticker}
        />
      )}
      {option.ticker !== 'No options' ? option.ticker.toUpperCase() : option.ticker}
      <span className="coin_name">{option.name}</span>
    </Box>
  )
}

export default renderRow
