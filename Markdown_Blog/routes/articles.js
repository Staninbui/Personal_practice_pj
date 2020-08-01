//路由文件,所有路由逻辑放在这里
//导入express模块,用于路由
const express = require('express')
//导入Article文章模版
const Article = require('./../models/article')
//导入Router设定路由请求
const router = express.Router()
//get, 访问/new路由时,渲染article,放到articles/new.ejs里
router.get('/new', (req, res) => {
    res.render('articles/new', { article: new Article() })
})
//get,访问/edit/:id,伪类id,async await 异步处理请求,通过findById来找对应的文章
router.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id)
    //渲染查到的文章到articles/edit.ejs里
    res.render('articles/edit', { article: article })
})
//get,访问/:slug 这些get和post都要异步,网络请求必须是异步否则网页适用性将大幅降低
//这里是处理read more的路由请求
router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug })
    //如果没有文章,则返回到主页
    if (article == null) res.redirect('/')
    //使用show.ejs模版渲染article
    res.render('articles/show', { article: article })
})
//post,处理新建文章的路由
router.post('/', async (req, res, next) => {
    //新建文章
    req.article = new Article()
    next()
    //新建文章的处理方式
    //转向到new.ejs页面
}, saveArticleAndRedirect('new'))

//put,:id伪id查找,新文章保存之后的页面路由
router.put('/:id', async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next()
}, saveArticleAndRedirect('edit'))

//delete,按照:id来删除文章,返回到主页
router.delete('/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

//函数接收一个路径,提供保存文章的内容功能
function saveArticleAndRedirect(path) {
    return async (req, res) => {
        let article = req.article
        article.title = req.body.title
        article.description = req.body.description
        article.markdown = req.body.markdown
        try {
            article = await article.save()
            //save成功之后会重新定位到对应的文章页面
            res.redirect(`/articles/${article.slug}`)
        } catch (e) {
            //失败则渲染文章到对应的path里
            res.render(`articles/${path}`, { article: article })
        }
    }
}

//导出router逻辑
module.exports = router