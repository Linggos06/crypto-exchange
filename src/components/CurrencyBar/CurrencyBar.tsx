import { ChangeEvent, SyntheticEvent, useState } from 'react'
import { Stack, Button, InputBase, Autocomplete, TextField, Box, Typography } from '@mui/material'
import ListBoxComponent from '../ListBoxComponent'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import ClearIcon from '@mui/icons-material/Clear'
import { ClickAwayListener } from '@mui/base/ClickAwayListener'
import { styled } from '@mui/material/styles'

import filterOptions from './helpers'
import { CurrencyOptionType, CurrencyType } from './types'

import './CurrencyBar.scss'

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  width: 'inherit',
  color: '#F6F7F8',
  '& .MuiInputBase-input': {
    boxSizing: 'border-box',
    width: 'inherit',
    height: '50px',
    padding: '14px 16px',
    color: '#282828',
    backgroundColor: '#F6F7F8',
    border: '1px solid #E3EBEF',
    borderRight: 'none',
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      paddingLeft: 16
    }
  }
}))

const StyledButton = styled(Button)(({ theme }) => ({
  maxWidth: 160,
  minWidth: 150,
  width: '100%',
  fontSize: 16,
  padding: '14px 0px 13px',
  color: '#282828',
  backgroundColor: '#F6F7F8',
  border: '1px solid #E3EBEF',
  borderRadius: 0,
  borderTopRightRadius: 5,
  borderBottomRightRadius: 5,
  boxShadow: 'none',
  textTransform: 'none',
  '.MuiButtonBase-root-MuiButton-root:hover': {
    opacity: 0.8,
    backgroundColor: '#F6F7F8',
    boxShadow: 'none'
  },
  [theme.breakpoints.up('sm')]: {
    minWidth: 150,
    width: '100%',
    lineHeight: '24px',
    fontSize: 16
  }
}))

interface CurrencyBarProps {
  currencies: CurrencyOptionType[]
  currency: CurrencyType
  getValue: (value: Record<string, string | number | null>) => void
  disabled?: boolean
}

const CurrencyBar = ({ currencies, currency, getValue, disabled = false }: CurrencyBarProps) => {
  const [open, setOpen] = useState(false)

  const handleClick = () => {
    setOpen(true)
  }
  const handleClickOutside = () => {
    setOpen(false)
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    getValue({ amount: value })
  }

  const handleCoinSelect = (
    event: SyntheticEvent<Element, Event>,
    newValue: string | CurrencyOptionType | null
  ) => {
    setOpen(false)
    if (typeof newValue === 'object' && newValue !== null) {
      getValue({ name: newValue.ticker, image: newValue.image })
    }
  }

  return (
    <Stack className="currency_bar-container" spacing={1} alignItems="flex-start">
      <Stack
        className="currency_bar"
        direction="row"
        justifyContent="center"
        alignItems="flex-start"
        spacing={0}>
        <StyledInputBase
          value={currency.amount}
          placeholder="123"
          disabled={disabled}
          onChange={handleInputChange}
          onKeyDown={(event) => {
            const pattern = /[0-9.]/

            if (!event.key.match(pattern) && event.key !== 'Backspace') {
              event.preventDefault()
            }
          }}
        />
        {open && (
          <ClickAwayListener onClickAway={handleClickOutside}>
            <Autocomplete
              open={open}
              freeSolo
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              getOptionDisabled={(option) => option.ticker === `No options`}
              filterOptions={filterOptions}
              options={currencies}
              getOptionLabel={(option) =>
                typeof option === 'string' ? option : option.inputValue || option.ticker
              }
              clearIcon={<ClearIcon fontSize="small" sx={{ color: '#80A2B6' }} />}
              onChange={handleCoinSelect}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search"
                  InputProps={{
                    ...params.InputProps
                  }}
                />
              )}
              ListboxComponent={ListBoxComponent}
              renderOption={(props, option, state) =>
                [props, option, state.index] as React.ReactNode
              }
            />
          </ClickAwayListener>
        )}

        <StyledButton
          id="search_coin-button"
          variant="contained"
          startIcon={
            <Box sx={{ width: 20 }}>
              {currency?.image && (
                <img
                  className="svg-image"
                  loading="lazy"
                  decoding="async"
                  width="20"
                  srcSet={currency?.image}
                  src={currency?.image}
                  alt={currency?.name}
                />
              )}
            </Box>
          }
          endIcon={<KeyboardArrowDownIcon className="keyboardArrowDownIcon" htmlColor="#80A2B6" />}
          onClick={handleClick}>
          <span>{currency?.name?.toUpperCase()}</span>
        </StyledButton>
      </Stack>
      {currency.error && (
        <Typography className="error_message" variant="subtitle2">
          {currency.error}
        </Typography>
      )}
    </Stack>
  )
}

export default CurrencyBar
