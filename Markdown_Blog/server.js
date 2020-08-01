//入口文件,服务器端

//导入express模块,用于路由创建
const express = require('express')
//从express模块中导出顶层函数express(),并用app变量接收
const app = express()
//导入mongoose模块,用于数据库创建
const mongoose = require('mongoose')
//导入文章数据库模版模块
const Article = require('./models/article')
//导入文章路由模块
const articleRouter = require('./routes/articles')
//method-override模块,扩展http请求,使客户端能够使用delete功能
//override with POST having ?_method=DELETE
//app.use(methodOverride('_method'))
//例子:如这般<form method="POST" action="/resource?_method=DELETE">
//<button type="submit">Delete resource</button>
//</form>
const methodOverride = require('method-override')

//mongoose.connect('mongodb://localhost/xxx',{})连接本地mongodb,固定格式.
mongoose.connect('mongodb://localhost/blog', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
})

//set,设定视图渲染模版,使用ejs扩展,不设定则默认使用html渲染模式
app.set('view engine', 'ejs')
//use,固定语句,必写,使用url解码
app.use(express.urlencoded({ extended: false }))
//use,固定写法,扩展_method的请求模式,这里是给到删除功能
app.use(methodOverride('_method'))
//get,请求主页时的响应内容, 异步async搭配await使用
app.get('/', async (req, res) => {
    //这里是调用的Dom对象的find方法,获取文章的数组,并按照降序排序.
    //mongoose导出的模块为DOM对象,要获取必须使用find
    const articles = await Article.find().sort({ createdAt: 'desc' })
    //获取到文章之后,render方法(渲染)到index.ejs图层里面,内容对象是获取的articles对象
    res.render('articles/index', { articles: articles })
})

//use,中间件,第一个参数接收路由指向名称,第二个接收router(处理方式)
app.use('/articles', articleRouter)

//listen,开启端口监听(开启服务器)
app.listen(5000)