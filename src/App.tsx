import { SetStateAction, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchData } from './config/axios/axiosUtils'
import { CssBaseline, Box, Container } from '@mui/material'
import Header from './components/Header'
import Exchange from './components/Exchange'
import CurrencyBar from './components/CurrencyBar'
import SwapIcon from './components/SwapIcon'
import { styled } from '@mui/material/styles'

import { CurrencyOptionType, CurrencyType } from './components/CurrencyBar/types'
import { DEPOSIT_TOO_SMALL, INACTIVE_PAIR } from './errorTypes'

import './App.scss'

const MainBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  marginTop: 1,
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    alignItems: 'center'
  }
}))

const ERROR_MESSAGE = 'This pair is disabled now'

const App = () => {
  const [coin1, setCoin1] = useState<CurrencyType>({
    name: 'btc',
    minSum: null,
    amount: '',
    image: '',
    error: ''
  })
  const [coin2, setCoin2] = useState<CurrencyType>({
    name: 'eth',
    amount: '',
    image: ''
  })
  const [error, setError] = useState('')

  const { data: currencies = [] } = useQuery({
    queryKey: ['currencies'],
    queryFn: () => fetchData('/currencies', handleCurrencies, console.error),
    staleTime: Infinity
  })

  const min_amount = useQuery({
    queryKey: ['min-amount', coin1.name, coin2.name],
    queryFn: () =>
      fetchData(
        `/min-amount/${coin1.name}_${coin2.name}?api_key=${import.meta.env.VITE_API_KEY}`,
        handleMinAmount,
        (error) => {
          if (error === INACTIVE_PAIR) {
            setCoin1((prev) => ({ ...prev, minSum: null }))
            setCoin2((prev) => ({ ...prev, amount: '-' }))
            setError(ERROR_MESSAGE)
          }
          return null
        }
      )
  })

  const exchange_amount = useQuery({
    queryKey: ['exchange-amount', coin2.name, coin1.amount],
    queryFn: () => {
      const amount = isNaN(parseFloat(coin1.amount)) ? 0 : parseFloat(coin1.amount)
      return fetchData(
        `/exchange-amount/${amount}/${coin1.name}_${coin2.name}?api_key=${
          import.meta.env.VITE_API_KEY
        }`,
        handleExchangeAmount,
        (error) => {
          if (error === DEPOSIT_TOO_SMALL) {
            setCoin1((prev) => ({
              ...prev,
              error: `Deposit is too small. Minimal sum is ${coin1.minSum}`
            }))
            setCoin2((prev) => ({ ...prev, amount: '-' }))
          }
          return null
        }
      )
    },
    enabled: !!coin1.minSum
  })

  const handleCurrencies = (data: any) => {
    const btc = data.find((el: CurrencyOptionType) => el.ticker === 'btc')
    const eth = data.find((el: CurrencyOptionType) => el.ticker === 'eth')
    setCoin1((prev) => ({ ...prev, image: btc?.image || '' }))
    setCoin2((prev) => ({ ...prev, image: eth?.image || '' }))
  }

  const handleMinAmount = (data: any) => {
    setError('')
    setCoin1((prev) => ({ ...prev, amount: data.minAmount, minSum: data.minAmount }))
  }

  const handleExchangeAmount = (data: any) => {
    setCoin1((prev) => ({ ...prev, error: '' }))
    setCoin2((prev) => ({ ...prev, amount: data.estimatedAmount }))
  }

  const swapCurrencies = () => {
    if (coin1.name === coin2.name) return
    setCoin1({ name: coin2.name, amount: '', image: coin2.image, error: '', minSum: null })
    setCoin2({ name: coin1.name, amount: '', image: coin1.image })
  }

  const handleCurrencyChange =
    (setter: { (value: SetStateAction<CurrencyType>): void }) =>
    (value: Record<string, string | number | null>) => {
      setter((prev) => ({ ...prev, ...value }))
    }

  return (
    <Container component="main" maxWidth="xl">
      <CssBaseline />
      <Header />
      <MainBox>
        <CurrencyBar
          {...{
            currencies,
            currency: coin1,
            getValue: handleCurrencyChange(setCoin1)
          }}
        />
        <Box className="swap_icon-container" onClick={swapCurrencies}>
          <SwapIcon />
        </Box>
        <CurrencyBar
          {...{
            currencies,
            currency: coin2,
            getValue: handleCurrencyChange(setCoin2),
            disabled: true
          }}
        />
      </MainBox>

      <Exchange {...{ error }} />
    </Container>
  )
}

export default App
