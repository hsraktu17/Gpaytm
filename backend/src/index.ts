import express, {Request, Response} from 'express'
import mainRouter from './routes/index'
import cors from 'cors'

const app = express();

app.use(cors())
app.use(express.json())

app.use('/api/v1/',mainRouter)


app.listen(3000,()=>console.log("Server started!!"))