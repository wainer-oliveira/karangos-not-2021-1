import TopBar from './ui/TopBar'
import { createMuiTheme, ThemeProvider, makeStyles } from '@material-ui/core/styles'
import yellow from '@material-ui/core/colors/yellow'
import pink from '@material-ui/core/colors/pink'
import FooterBar from './ui/FooterBar'
import {Box} from '@material-ui/core'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
// import KaragonsList from './routed/KarangosList'
import KaragonsList from './routed/KarangosList2'
import KaragonsForm from './routed/KarangosForm'

const useStyles = makeStyles((theme) => ({
  box: {
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
    paddingBottom: '42px'
  },
  routed: {
    padding: '25px',
    color: theme.palette.text.primary,
    fontFamily: theme.typography.fontFamily
  }
}))

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: yellow[500],
    },
    secondary: {
      main: pink[500],
    },
  },
})

function Main() {
  const classes = useStyles()
  return(
    <Box className={classes.box}>
      <BrowserRouter>
        <TopBar/>
        <Box id="routed" className={classes.routed}>
          <Switch>
            <Route path="/list">
              <KaragonsList />
            </Route>
            <Route path="/new">
              <KaragonsForm />
            </Route>
            <Route path="/edit/:id">
              {/* 
                id: é um parâmetro (nomes de parâmetros começam com dois pontos)
              */}
              <KaragonsForm />
            </Route>
          </Switch>
        </Box>
        <FooterBar/>
      </BrowserRouter>
  </Box>
  )
}

function App() {
  return (
  <ThemeProvider theme={theme}>
     <Main />
  </ThemeProvider>
  )
}

export default App
