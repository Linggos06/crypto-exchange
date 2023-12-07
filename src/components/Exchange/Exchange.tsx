import { Button, Grid, InputBase, InputLabel, Typography } from '@mui/material'

import './Exchange.scss'

type ExchangeProps = {
  error: string
}

const Exchange = ({ error }: ExchangeProps) => {
  return (
    <Grid className="exchange_container" container spacing={4}>
      <Grid item xs={12} sm={8}>
        <InputLabel className="address_label" htmlFor="address">
          Your Ethereum address
        </InputLabel>
        <InputBase id="address" fullWidth />
      </Grid>

      <Grid className="exchange_button-container" item xs={12} sm={4}>
        <Button
          type="button"
          className="exchange_button"
          variant="contained"
          fullWidth
          sx={{ mt: 3, mb: 2 }}>
          Exchange
        </Button>
        {error && (
          <Typography className="error_message" variant="subtitle2" color={'#E03F3F'}>
            {error}
          </Typography>
        )}
      </Grid>
    </Grid>
  )
}

export default Exchange
