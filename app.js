//imports
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const app = express()
const port =3000

//static files
app.use(express.static('public'))

app.use('/css',express.static(__dirname +'public/css'))


//set Templating Engine

app.use(expressLayouts)
app.set('layout','./layouts/full-width')
app.set('view engine','ejs')

 //navigation
app.get('',(req,res)=>{
  res.render('index',{title:'Home Page'})
})

app.get('/article',(req,res)=>{
  res.render('article',{title:'Article Page',layout:'./layouts/sidebar'})
})







//listen on port 3000
app.listen(port,()=>console.info('App Listening on port ${port}'))





