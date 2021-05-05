import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import logoImg from '../img/karangos.png'
import MainMenu from './MainMenu'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  logo: {
      width: '300px'
  }
}))

export default function TopBar() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <MainMenu />
          <img src={logoImg} className={classes.logo} alt="logotipo Karangos"/>
        </Toolbar>
      </AppBar>
    </div>
  )
}