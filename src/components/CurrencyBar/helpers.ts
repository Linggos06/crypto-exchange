import { FilterOptionsState } from '@mui/material'
import { CurrencyOptionType } from './types'

const filterOptions = (
  options: CurrencyOptionType[],
  params: FilterOptionsState<CurrencyOptionType>
) => {
  const { inputValue } = params

  const filtered = options.filter((option) => {
    return (
      option.ticker.toLowerCase().includes(inputValue.toLowerCase()) ||
      option.name?.toLowerCase().includes(inputValue.toLowerCase())
    )
  })

  if (inputValue !== '' && filtered.length === 0) {
    filtered.push({
      inputValue: `No options`,
      ticker: `No options`,
      image: ''
    })
  }

  return filtered
}

export default filterOptions
