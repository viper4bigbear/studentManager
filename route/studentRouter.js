const express = require('express')
const path = require('path')
const template = require('art-template')
const helperRouter = require('../tools/helperRouter')

let router = express()

router.use((req, res, next) => {
  if (req.url !== '/logout') {
    if (req.session.userName) {
      next()
    } else {
      helperRouter.tips(res, '请登录', '/manager/login')
    }
  } else {
    next()
  }
})

router.get('/index', (req, res) => {
  let obj = {}
  if (req.query.search) {
    obj = {userName: {$regex: req.query.search}}
    helperRouter.find('student', obj, (results) => {
      let html = template(path.join(__dirname, '../static/template/index.html'), {
        userName: req.session.userName,
        results,
        search: req.query.search
      })
      res.send(html)
    })
  } else {
    helperRouter.find('student', {}, (results) => {
      let html = template(path.join(__dirname, '../static/template/index.html'), {
        userName: req.session.userName,
        results
      })
      res.send(html)
    })
  }
  // console.log(req.query.search)
})

router.get('/logout', (req, res) => {
  delete req.session.userName
  res.redirect('/manager/login')
})

router.get('/insert', (req, res) => {
  let html = template(path.join(__dirname, '../static/template/add.html'), {
    userName: req.session.userName
  })
  res.send(html)
})

router.post('/insert', (req, res) => {
  helperRouter.insertOne('student', req.body, (results) => {
    // res.send(results)
    if (results.n === 1) {
      helperRouter.tips(res, '新增成功', '/student/index')
    } else {
      helperRouter.tips(res, '新增失败,请重新添加', '/student/insert')
    }
  })
})

router.get('/delete/:id', (req, res) => {
  let id = req.params.id
  helperRouter.deleteOne('student', {_id: helperRouter.ObjectId(id)}, (results) => {
    if (results.n === 1) {
      res.redirect('/student/index')
    } else {
      helperRouter.tips(res, '删除失败,请重试', '/student/index')
    }
  })
})

router.get('/edit/:id', (req, res) => {
  let id = req.params.id
  helperRouter.find('student', {_id: helperRouter.ObjectId(id)}, (results) => {
    // res.send(results)
    let html = template(path.join(__dirname, '../static/template/edit.html'), {
      userName: req.session.userName,
      results: results[0]
    })
    res.send(html)
  })
})

router.post('/edit', (req, res) => {
  let _id = req.body._id
  _id = _id.replace(/"/g, '')
  delete req.body._id
  // console.log(req.body)
  helperRouter.updateOne('student', {_id: helperRouter.ObjectId(_id)}, req.body, (results) => {
    if (results.n === 1) {
      helperRouter.tips(res, '修改成功', '/student/index')
    } else {
      helperRouter.tips(res, '修改失败,请重试', '/student/index')
    }
  })
})

module.exports = router
