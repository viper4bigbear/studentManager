const express = require('express')
const path = require('path')
const helperRouter = require('../tools/helperRouter')
const svgCaptcha = require('svg-captcha')
let router = express()

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../static/template/login.html'))
})

router.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../static/template/register.html'))
})

router.post('/register', (req, res) => {
  let userName = req.body.userName
  let password = req.body.password
  helperRouter.find('student', {userName}, (results) => {
    if (results.length) {
      // 已注册,提醒用户返回注册页面
      helperRouter.tips(res, '用户名已存在,请重新注册', '/manager/register')
    } else {
      // 未注册,添加进数据库
      helperRouter.insertOne('student', {userName, password}, (results) => {
        if (results.result.n === 1) {
          helperRouter.tips(res, '注册成功', '/manager/login')
        } else {
          helperRouter.tips(res, '注册失败,请重试', '/manager/register')
        }
      })
    }
  })
})

router.get('/vCode', (req, res) => {
  let captcha = svgCaptcha.create()
  req.session.captcha = captcha.text
  res.type('svg')
  res.status(200).send(captcha.data)
})

router.post('/login', (req, res) => {
  let userName = req.body.userName
  let password = req.body.password
  let vCode = req.body.vCode
  if (vCode === req.session.captcha) {
    helperRouter.find('student', {userName, password}, (results) => {
      if (results.length) {
        // 登录成功
        helperRouter.tips(res, '登录成功', '/student/index')
      } else {
        // 用户名或密码错误
        helperRouter.tips(res, '用户名或密码错误,请重新登录', '/manager/login')
      }
    })
  } else {
    helperRouter.tips(res, '验证码错误,请重新登录', '/manager/login')
  }
})
module.exports = router
