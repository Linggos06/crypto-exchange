import { Typography } from '@mui/material'

import './Header.scss'

const Header = () => {
  return (
    <>
      <Typography className="title main_title" component="h1" variant="h5">
        Crypto Exchange
      </Typography>
      <Typography className="title subtitle" variant="subtitle2">
        Exchange fast and easy
      </Typography>
    </>
  )
}

export default Header
