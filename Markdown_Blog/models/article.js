//模块文件,负责处理文章数据保存模版

//导入mongoose模块
const mongoose = require('mongoose')
//导入marked模块,用于解析markdown语法
const marked = require('marked')
//导入slugify,用于字符串拼接的一个模块 多用于url链接的拼接
//例子1: slugify('some string')  输出: some-string
//例子2: slugify('some string','_')  输出: some_string
const slugify = require('slugify')
//导入Dom过滤模块,用于过滤特殊字符或者不合规HTMl输入等会导致XSS攻击的情况
//因为要解析markdown语法,会涉及到很多的特殊字符,因此这里就需要dompurify来进行字符过滤动作避免出现问题
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)
//以上三句为dompurify固定格式

//new mongoose.Schema({}),创建一个mongoose数据库格式的模版对象
//此处的mongoose.Schema为构造函数(可以new的都是构造函数)
const articleSchema = new mongoose.Schema({
    //文章属性包括标题,描述,markdown语法,创建时间
    //文章链接url包括slug,sanitizedHtml(过滤的安全Html)
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    markdown: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    sanitizedHtml: {
        type: String,
        required: true
    }
})

//中间件（也称为pre and post hook）是执行异步函数期间传递控制权的函数。中间件在schema级别上被指定并对于编写插件非常有用。
//对每一篇文章对象预先格式化处理(pre hook),包括url地址和markdown文本部分
//next为hook next function 用于遍历所有的对象
articleSchema.pre('validate', function (next) {
    //如果title存在,那么调用slugify(参数1:想要拼接的字符串变量,参数2:设定字符串变换模式(正则),lower,全部小写化,strict,严格模式,各类符号全部都会转换成字母)
    //例子,开启严格模式:WDS_@#&*%$@#$   =>   wdsandpercentdollardollar
    //未开启严格模式:WDS_#@!$  =>   wds_@!dollar
    if (this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true })
    }
    //如果实例markdown存在,先调用marked()解析语法,然后调用dompurify.sanitize来过滤掉危险字符
    if (this.markdown) {
        this.sanitizedHtml = dompurify.sanitize(marked(this.markdown))
    }
    //每一个对象都要用,这里的next()不可少
    next()
})

//module.exports, model, 导出mongoose模块,用于创建相同Schema的对象实例
//参数1: 导出后的名字叫Article, 参数2: 导出的对象是什么
module.exports = mongoose.model('Article', articleSchema)