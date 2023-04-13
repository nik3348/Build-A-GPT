import { Grid, IconButton, InputAdornment, InputBase } from "@mui/material"

import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import styles from '@/styles/Home.module.css';

const Header = () => {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={2}>
          The <span className={styles.readLogo}>READING</span> Corner
        </Grid>
        <Grid item xs={5}>
          <InputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
            style={{ color: '#ffffff', backgroundColor: '#78797a', borderRadius: '4px', padding: '3px 5px', width: '100%' }}
            startAdornment={
              <InputAdornment position="start" className={styles.searchBar}>
                <SearchIcon />
              </InputAdornment>
            }
          />
        </Grid>
        <Grid item xs={2}>
          <IconButton aria-label="delete" className={styles.searchBar}>
            <AccountCircleIcon />
            Profile
          </IconButton>
        </Grid>
        <Grid item xs={0}>
          <div className={styles.divider}>
            |
          </div>
        </Grid>
        <Grid item xs={2}>
          <IconButton aria-label="delete" className={styles.searchBar}>
            <ShoppingCartIcon />
            Cart
          </IconButton>
        </Grid>
      </Grid>
    </>
  )
}

export default Header
