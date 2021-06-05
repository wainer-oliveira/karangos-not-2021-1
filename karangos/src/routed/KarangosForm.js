import {useState, useEffect} from 'react'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import {makeStyles} from '@material-ui/core/styles'
import { Button, FormControlLabel, Toolbar } from '@material-ui/core'
import FormControl from '@material-ui/core/FormControl'
import Checkbox from '@material-ui/core/Checkbox'
import InputMask from 'react-input-mask'
import InputAdornment from '@material-ui/core/InputAdornment'
import axios from 'axios'
import ConfirmDialog from '../ui/ConfirmDialog'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'
import {useHistory, useParams} from 'react-router-dom'

const useStyles = makeStyles(() => ({
  form: {
    maxWidth: '90%',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    '& .MuiFormControl-root': {
      minWidth: '200px',
      maxWidth: '500px',
      marginBottom: '24px'
    }
  },
  toolbar: {
    marginTop: '36px',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-around'
  },
  checkbox: {
    alignItems: 'center'
    
  }
}))
/* classes de características de entrada para a entrada do campo placa
    1) 3 primeiras posições: qualquer letra de A a Z (maiúscula ou minúscula) ~> [A-Za-z]
    2) Posições númericas (1ª, 2ª, 3ª, e 4ª depois do traço) ~> [0-9]
    3) 2ª posição após o traço: pode receber dígitos
     ou letras entre A e J (maiúscula ou minúscula) ~> [0-9A-Ja-j]
*/

// Representando as classes de caracteres da máscara como um objeto
const formatChars = {
  'A':'[A-Za-z]',
  '0':'[0-9]',
  '#':'[0-9A-Ja-j]'
}

// Máscara de entrada do campo placa
const placaMask = 'AAA-0#00'

export default function KaragonsForm() {
  const classes = useStyles()
  const [currentId, setCurrentId] = useState()
  const [importadoChecked, setImportadoChecked] = useState()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isModified, setIsModified] = useState(false)
  const [title, setTitle] = useState('Cadastrar novo Karango')
  const [karango, setKarango] = useState({
    id: null,
    marca: '',
    modelo: '',
    cor: '',
    ano_fabricacao: (new Date()).getFullYear(),
    importado: '0',
    placa: '',
    preco: 0
  })
  
  const [snackState, setSnackState] = useState({
    open: false,
    severity: 'success',
    message: 'Karango salvo com sucesso' 
  })
  
  const [btnSendState, setBtnSendState] = useState({
    disabled: false,
    label: 'Enviar'
  })

  const [error, setError] = useState({
    marca: '',
    modelo: '',
    cor: '',
    placa: '',
    preco: ''
  })
  
  const history = useHistory()
  const params = useParams()

  useEffect(() => {
    // Verifica se tem o parâmetro id na rota. Se tiver, temos que busca
    // os dados do registro no back-end para edição
    if(params.id) {
      setTitle('Editando Karango')
      getData(params.id)
    }
  }, [])
  async function getData(id) {
    try {
      let response = await axios.get(`https://api.faustocintra.com.br/karangos/${id}`)
      setKarango(response.data)
    }
    catch(error) {
      setSnackState({
        open: true,
        severity: 'error',
        error: 'Não foi possível carregar os dados para edição.'
      })
    }
  }

  function handleInputChange(event, property) {
    const karangoTemp = {...karango}
    let importadoCheckedTemp = importadoChecked

    if(event.target.id) property = event.target.id

    if(property === 'importado') {
      const newState = ! importadoChecked
      // setKarango({...karango, importado: (newState ? '1':'0')})
      karangoTemp.importado = (newState ? '1':'0')
      importadoCheckedTemp = newState
    } 
    else if(property === 'placa') {
      // setKarango({...karango, [property]: event.target.value.toUpperCase()})
      karangoTemp[property] = event.target.value.toUpperCase()
    }
    else {
      // setKarango({...karango, [property]: event.target.value})
      karangoTemp[property] = event.target.value
    }
    setKarango(karangoTemp)
    setImportadoChecked(importadoCheckedTemp)
    setIsModified(true)
    validate(karangoTemp)

  }

  function validate(data) {
    const errorTemp = {
      marca: '',
      modelo: '',
      cor: '',
      placa: '',
      preco: ''
    }
    let isValid = true
    // trim() retira espaços em brancos no final e no começo de uma string
    // Validação dos campos marca
    if(data.marca.trim() === '') {
      errorTemp.marca = 'A marca deve ser preenchida'
      isValid = false
    }

    // Validação dos campos modelo
    if(data.modelo.trim() === '') {
      errorTemp.modelo = 'A modelo deve ser preenchido'
      isValid = false
    }

    // Validação dos campos cor
    if(data.cor.trim() === '') {
      errorTemp.cor = 'A cor deve ser preenchida'
      isValid = false
    }

    // Validação dos campos placa
    // Valor válido não pode ser string vazia nem conter caractere "-"
    if(data.placa.trim() === '' || data.placa.includes('_')) {
      errorTemp.placa = 'A placa deve ser corretamente preenchida'
      isValid = false
    }

    // Validação do campo preço
    // Deve ser numérico e maior que 0
    if(isNaN(data.preco) || +(data.preco) <= 0) {
      errorTemp.preco = 'A preço deve ser preenchido e maior que zero'
      isValid = false
    }

    setError(errorTemp)
    return isValid

  }

  function years() {
    let result = []
    for(let i = (new Date()).getFullYear(); i>= 1900; i--) result.push(i)
    return result
  }
  
  function handleSubmit(event) {
    event.preventDefault() // Evita o recarregamento da página
    saveData()
  }

  async function saveData() {
    try {
      // Desabilitar o botão Enviar
      setBtnSendState({disabled: true, label: 'Enviando...'})

      // Se o registro já existe (ver HTTP PUT)
      if(params.id) await axios.put(`https://api.faustocintra.com.br/karangos/${params.id}`, karango)
      // Se o registro não existe, cria-se um novo (verbo HTTP POST)
      else await axios.post('https://api.faustocintra.com.br/karangos', karango)
      
      setSnackState({
        open: true,
        severity: 'success',
        message: 'Karango salvo com sucesso' 
      })
    } 
    catch(error) {
      setSnackState({
        open: true,
        severity: 'error',
        message: 'ERRO: ' + error.messag 
      })
    }
    // Reabilitar o botão Enviar
    setBtnSendState({disabled: false, label: 'Enviar'})
  }

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />
  }

  function handleSnackClose(event, reason) {
    // Evita que a snackbar seja fechada clicando-se fora dela
    if(reason === 'clickaway') return 
    setSnackState({...snackState, open: false})

    // Retorna a página de listagem
    history.push('/list')
  }
  
  function handleDialogClose(result) {
    setDialogOpen(false)
    // Se o usuário concordou em voltar
    if(result) history.push('/list')
  }

  function handleGoBack() {
    // Se o usário tiver modificado mostra diálogo de confirmação
    if(isModified) setDialogOpen(true)
    else history.push('/list')
  }

  return(
    <>
      <ConfirmDialog isOpen={dialogOpen} onClose={handleDialogClose}>
        Há dados não salvos. Deseja realmente voltar?
      </ConfirmDialog>
      <Snackbar open={snackState.open} autoHideDuration={6000} onClose={handleSnackClose}>
        <Alert onClose={handleSnackClose} severity={snackState.severity}>
          {snackState.message}
        </Alert>
      </Snackbar>

      <h1>{title}</h1>
      <form className={classes.form} onSubmit={handleSubmit}>
        <TextField 
          fullWidth 
          id="marca" 
          label="Marca" 
          variant="filled" 
          value={karango.marca} 
          onChange={handleInputChange} 
          required
          error = {error.marca !== ''}
          helperText = {error.marca}
        />

        <TextField 
          fullWidth 
          id="modelo" 
          label="Modelo" 
          variant="filled" 
          value={karango.modelo} 
          onChange={handleInputChange} 
          required
          error = {error.modelo !== ''}
          helperText = {error.modelo}
        />
      
        <TextField 
          fullWidth 
          id="cor" 
          label="Cor" 
          variant="filled" 
          value={karango.cor} 
          onChange={event => handleInputChange(event, 'cor')} 
          required
          error = {error.cor !== ''}
          helperText = {error.cor}
          select
        >
          <MenuItem value="Amarelo">Amarelo</MenuItem>
          <MenuItem value="Azul">Azul</MenuItem>
          <MenuItem value="Bege">Bege</MenuItem>
          <MenuItem value="Branco">Branco</MenuItem>
          <MenuItem value="Cinza">Cinza</MenuItem>
          <MenuItem value="Dourado">Dourado</MenuItem>
          <MenuItem value="Laranja">Laranja</MenuItem>
          <MenuItem value="Marrom">Marrom</MenuItem>
          <MenuItem value="Prata">Prata</MenuItem>
          <MenuItem value="Preto">Preto</MenuItem>
          <MenuItem value="Roxo">Roxo</MenuItem>
          <MenuItem value="Verde">Verde</MenuItem>
          <MenuItem value="Vermelho">Vermelho</MenuItem>
        </TextField>

        <TextField 
          fullWidth
          id="ano_fabricacao"
          label="Ano de Fabricação"
          variant="filled"
          value={karango.ano_fabricacao} 
          onChange={event => handleInputChange(event, 'ano_fabricacao')} 
          required
          select
        >
            {
              years().map(year => <MenuItem key={year} value={year}>{year}</MenuItem>)
            }
        </TextField>

        <TextField 
          fullWidth 
          id="preco" 
          label="Preço" 
          variant="filled" 
          value={karango.preco} 
          onChange={handleInputChange} 
          onFocus={event => event.target.select()}
          type="number"
          InputProps={{
            startAdornment: <InputAdornment position="start">R$</InputAdornment>,
          }}
          required
          error = {error.preco !== ''}
          helperText = {error.preco}
        />

        <InputMask 
          formatChars={formatChars} 
          mask={placaMask} 
          id="placa" 
          value={karango.placa} 
          onChange={event => handleInputChange(event,'placa')}
        >
          {() => <TextField 
            fullWidth  
            label="Placa" 
            variant="filled"
            required
            error = {error.placa !== ''}
            helperText = {error.placa}
          />}
        </InputMask>
  
        <FormControl fullWidth className={classes.checkbox}>
          <FormControlLabel 
            control={<Checkbox 
            checked={importadoChecked} 
            onChange={handleInputChange} 
            id="importado" />} 
            label="Importado?"
          />
        </FormControl>

        <Toolbar className={classes.toolbar}>
          <Button 
            variant="contained" 
            color="secondary" 
            type="submit"
            disabled={btnSendState.disabled}
          >
              {btnSendState.label}
          </Button>

          <Button variant="contained" onClick={handleGoBack}>
            Voltar
          </Button>
        </Toolbar>

        {/* <div>{JSON.stringify(karango)}<br/><br/>currentId: {currentId}</div> */}

      </form>
    </>
  )
}