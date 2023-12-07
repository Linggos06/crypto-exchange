import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AxiosError, AxiosResponse } from 'axios'
import { apiGet } from './config/axios/axiosUtils'
import { CssBaseline, Box, Container } from '@mui/material'
import Header from './components/Header'
import Exchange from './components/Exchange'
import CurrencyBar from './components/CurrencyBar'
import SwapIcon from './components/SwapIcon'
import { styled } from '@mui/material/styles'

import { CurrencyOptionType, CurrencyType } from './components/CurrencyBar/types'

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
    queryFn: async () => {
      try {
        const response: AxiosResponse = await apiGet('/currencies')
        const data = response.data as CurrencyOptionType[]

        const btc = data.find((el) => el.ticker === 'btc')
        const eth = data.find((el) => el.ticker === 'eth')

        setCoin1((prev) => ({ ...prev, image: btc?.image || '' }))
        setCoin2((prev) => ({ ...prev, image: eth?.image || '' }))

        return data
      } catch (error) {
        console.error(error)
      }
    },
    staleTime: Infinity
  })

  const min_amount = useQuery({
    queryKey: ['min-amount', coin1.name, coin2.name],
    queryFn: async () => {
      setError('')
      try {
        const response: AxiosResponse = await apiGet(
          `/min-amount/${coin1.name}_${coin2.name}?api_key=${import.meta.env.VITE_API_KEY}`
        )
        const data = response.data
        setCoin1((prev) => ({ ...prev, amount: data.minAmount, minSum: data.minAmount }))
        return data
      } catch (error: AxiosError | unknown) {
        if (error instanceof AxiosError) {
          const response = error?.response?.data
          if (response.error === 'pair_is_inactive') {
            setCoin1((prev) => ({ ...prev, minSum: null }))
            setCoin2((prev) => ({ ...prev, amount: '-' }))
            setError('This pair is disabled now')
          }
        }
        return null
      }
    }
  })

  const exchange_amount = useQuery({
    queryKey: ['exchange-amount', coin2.name, coin1.amount],
    queryFn: async () => {
      const amount = isNaN(parseFloat(coin1.amount)) ? 0 : parseFloat(coin1.amount)
      try {
        const response: AxiosResponse = await apiGet(
          `/exchange-amount/${amount}/${coin1.name}_${coin2.name}?api_key=${
            import.meta.env.VITE_API_KEY
          }`
        )
        const data = response.data
        setCoin1((prev) => ({ ...prev, error: '' }))
        setCoin2((prev) => ({ ...prev, amount: data.estimatedAmount }))
        return data
      } catch (error: AxiosError | unknown) {
        if (error instanceof AxiosError) {
          const response = error?.response?.data
          if (response.error === 'deposit_too_small') {
            setCoin1((prev) => ({
              ...prev,
              error: `Deposit is too small. Minimal sum is ${coin1.minSum}`
            }))

            setCoin2((prev) => ({ ...prev, amount: '-' }))
          }

          if (response.error === 'pair_is_inactive') {
            setCoin2((prev) => ({ ...prev, amount: '-' }))
            setError('This pair is disabled now')
          }
        }
        return null
      }
    },
    enabled: !!coin1.minSum
  })

  const swapCurrencies = () => {
    if (coin1.name === coin2.name) return
    setCoin1({ name: coin2.name, amount: '', image: coin2.image, error: '', minSum: null })
    setCoin2({ name: coin1.name, amount: '', image: coin1.image })
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
            getValue: (value) => {
              setCoin1((prev) => ({ ...prev, ...value }))
            }
          }}
        />
        <Box className="swap_icon-container" onClick={swapCurrencies}>
          <SwapIcon />
        </Box>
        <CurrencyBar
          {...{
            currencies,
            currency: coin2,
            getValue: (value) => {
              setCoin2((prev) => ({ ...prev, ...value }))
            },
            disabled: true
          }}
        />
      </MainBox>

      <Exchange {...{ error }} />
    </Container>
  )
}

export default App
