import axios from 'axios'
import {useHistory} from 'react-router-dom'
import AddBoxIcon from '@material-ui/icons/AddBox'
import { useEffect, useState } from 'react'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import CheckBox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
    },
    tableRow: {
        '& button': {           // linha da tabela em estado "normal"
            visibility: 'hidden'
        },
        '&:hover': {            // linha da tabela com mouse sobreposto
            backgroundColor: theme.palette.action.hover
        },
        '&:hover button': {     // botões na linha com mouse sobreposto
            visibility: 'visible'
        }
    },
    toolbar: {
        justifyContent: 'flex-end',
        paddingRight: 0
    }
}))

export default function KarangosList() {
    const classes = useStyles()
    const history = useHistory()
    const [karangos, setKarangos] = useState([])

    useEffect(() => {
        const getData = async () => {
            try {
                let response = await axios.get('https://api.faustocintra.com.br/karangos?by=marca,modelo')
                setKarangos(response.data)
            }
            catch (error) {
                console.log(error)
            }
        }
        getData()
    }, [])
    // Quando a dependência do useEffect é um vetor vazio,
    // isso indica que ele será rodado apenas uma vez, na 
    // inicialização do componente

    return (
        <>
            <h1>Listagem de Karangos</h1>
            <Toolbar className={classes.toolbar}>
                <Button color="secondary" variant="contained" 
                size="large" startIcon={<AddBoxIcon/>} onClick={() => history.push("/new")}>
                    Novo karango
                </Button>
            </Toolbar>
            <TableContainer component={Paper}>
                <Table className={classes.table} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="right">Código</TableCell>
                            <TableCell>Marca</TableCell>
                            <TableCell>Modelo</TableCell>
                            <TableCell>Cor</TableCell>
                            <TableCell align="center">Ano</TableCell>
                            <TableCell align="center">Importado?</TableCell>
                            <TableCell align="center">Placa</TableCell>
                            <TableCell align="center">Preço</TableCell>
                            <TableCell align="center">Editar</TableCell>
                            <TableCell align="center">Excluir</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            karangos.map(karango =>
                                <TableRow key={karango.id} className={classes.tableRow}>
                                    <TableCell align="right">{karango.id}</TableCell>
                                    <TableCell>{karango.marca}</TableCell>
                                    <TableCell>{karango.modelo}</TableCell>
                                    <TableCell>{karango.cor}</TableCell>
                                    <TableCell align="center">{karango.ano_fabricacao}</TableCell>
                                    <TableCell align="center">
                                        <CheckBox checked={karango.importado === '1'} color="primary" readOnly />
                                    </TableCell>
                                    <TableCell align="center">{karango.placa}</TableCell>
                                    <TableCell align="center">
                                        {Number(karango.preco).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton aria-label="delete">
                                            <EditIcon/>
                                        </IconButton>
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton aria-label="delete">
                                            <DeleteIcon color="error" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}