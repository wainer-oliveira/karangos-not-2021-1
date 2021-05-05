import { Typography, Toolbar } from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import LocalCafeTwoToneIcon from '@material-ui/icons/LocalCafeTwoTone'

const useStyles = makeStyles((theme) => ({
    text: {
        width: '100%',
        color: theme.palette.text.secondary
    },
    toolbar: {
        backgroundColor: theme.palette.background.paper,
        minHeight: '42px',
        width: '100%',
        position: 'fixed',
        bottom: 0
    },
    link: {
        color: theme.palette.secondary.light,
        textDecoration: 'none',
        '&:hover': { // mouse passando por cima do componente
            textDecoration: 'underline'
        }
    }
}))

export default function FoobterBar() {
    const classes = useStyles()
    return(
        <Toolbar className={classes.toolbar}>
            <Typography variant="caption" align="center" className={classes.text}>
                Desenvolvido com <LocalCafeTwoToneIcon fontSize='small'/> por <a
                 href="mailto:wainer.oliveira.luiz@gmail.com" 
                 className={classes.link}>Wainer de Oliveira</a>
            </Typography>
        </Toolbar>
    )
}