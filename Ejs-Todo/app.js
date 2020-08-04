//入口文件
const getDate = require('./date.js');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

//建立一个数组用于保存to-do
var items = [];

//设定ejs渲染引擎(准备前提为放置了views文件夹和带有index.ejs文件)
app.set('view engine', 'ejs');

//设定数据发送给服务器时的解码方法,bodyParser.urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
//设定静态资源解析的目录,比如css等文件,设定之后ejs当中的引用路径只需要写css/styles.css即可
app.use(express.static("public"));

//get路由
app.get('/', (req, res) => {

    let day = getDate();

    res.render("list", { day: day, items: items });
});

app.post('/', (req, res) => {
    //post方法不能用于渲染,只能接收,渲染都在get方
    //这边req.body接收到数据之后,redirect返回到 "/",重新触发get请求,刷新页面.
    item = req.body.newItem
    items.push(item);
    res.redirect('/')
})

app.listen(3000, () => {
    console.log('server start');
});