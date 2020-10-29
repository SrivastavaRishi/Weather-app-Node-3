const path = require('path');
const express = require('express');
const hbs = require('hbs')
const app = express();
const bodyParser = require('body-parser')
const https = require('https')

const port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({extended:true}));

const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

app.set('view engine', 'hbs');
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.use(express.static(publicDirectoryPath))

console.log(publicDirectoryPath)

// console.log('The location is ' + req.body.Cityname)


app.get('/', (req, res) => {
    res.render('index', {
        title : 'Weather',
        creater : 'Rishi Srivastava'
    })
    
})

app.post("/",function(req, res){
    const query = req.body.Cityname;
    const apikey = "867e684645abed7b75d619f43c5b0571";
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apikey +"&units="+unit;
  
    https.get(url, function(response){
      //console.log(response.statusCode);
      if(response.statusCode === 200){
      response.on("data", function(data){
        const weatherData = JSON.parse(data);
        //console.log(weatherData.weather[0].description);
        //res.send(weatherData);
        res.render('result', {
            query : weatherData.name, 
            temperature : weatherData.main.temp, 
            creater : 'Rishi Srivastava', 
            humidity : weatherData.main.humidity, 
            description : weatherData.weather[0].description
        });
  
    })}else{
        console.log('Enter valid city');
        res.render('error', {
            message : 'Enter valid city', 
            creater : 'Rishi Srivastava'
        })
      }
    })
  
  })


app.get('/about', (req, res) => {
    res.render('about', {
        title : 'About',
        creater : 'Rishi Srivastava'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title : 'Help',
        message : 'How may I help you?',
        creater : 'Rishi Srivastava'
    })
})

app.get('/help/*', (req, res) => {
    res.render('error', {
        message : 'Help arcticle not found!',
        creater : 'Rishi Srivastava'
    })
})

app.get('*', (req, res) => {
    res.render('error', {
        message : 'Page not found!', 
        creater : 'Rishi Srivastava'
    })
})

app.listen(port, () => console.log('Server is running successfull on port ' + port))
