import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import {makeStyles} from '@material-ui/core/styles'
import MenuIcon from '@material-ui/icons/Menu'
import {Link} from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
    menuButton: {
      marginRight: theme.spacing(2),
    },
    menuLink: {
      color: theme.palette.text.primary,
      textDecoration: 'none'
    }
}))

export default function MainMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const classes = useStyles()

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>

      <IconButton edge="start" className={classes.menuButton} color="inherit"
      aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} 
      aria-label="menu">
            <MenuIcon />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose} >
          <Link className={classes.menuLink} to="/list">Listagem de karangos</Link>
        </MenuItem>
        <MenuItem onClick={handleClose} className={classes.menuItem}>
          <Link className={classes.menuLink} to="/new">Cadastrar novo karango</Link>
        </MenuItem>
      </Menu>
    </div>
  )
}
