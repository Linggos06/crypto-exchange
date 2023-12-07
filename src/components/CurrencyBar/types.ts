export type CurrencyOptionType = {
  ticker: string
  name?: string
  image: string
  hasExternalId?: boolean
  isFiat?: boolean
  featured?: boolean
  isStable?: boolean
  supportsFixedRate?: boolean
  inputValue?: string
}

export type CurrencyType = {
  name: string
  image: string
  amount: string
  minSum?: number | null
  error?: string
}
