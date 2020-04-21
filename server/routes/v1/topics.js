const Router = require('koa-router')
const router = new Router()
const request = require('../../request')
const validator = require('../../middleware/validator')
const config = require('../../request/config')
const { toObject } = require('../../../utils')

/**
 * 获取话题列表
 * @param {string} sortType - 排序
 * @param {number} page - 页码
 * @param {number} pageSize - 条数
 */
router.get('/list', validator({
  sortType: { type: 'enum', enum: ['hot', 'new'], required: true },
  page: { 
    type: 'string', 
    required: true,
    validator: (rule, value) => Number(value) > 0,
    message: 'page 需传入正整数'
  },
  pageSize: { 
    type: 'string', 
    required: true,
    validator: (rule, value) => Number(value) > 0,
    message: 'pageSize 需传入正整数'
  },
}), async (ctx, next) => {
  const options = {
    url: 'https://short-msg-ms.juejin.im/v1/topicList',
    method: "GET",
    params: {
      device_id: config.deviceId,
      src: 'web',
      token: config.token,
      uid: config.uid,
      sortType: ctx.query.sortType,
      page: ctx.query.page - 1,
      pageSize: ctx.query.pageSize
    }
  };
  let { body } = await request(options)
  ctx.body = body
})

/**
 * 获取已关注话题列表
 * @param {string} after
 * @param {number} page - 页码
 * @param {number} pageSize - 条数
 */
router.get('/followedList', validator({
  after: { type: 'string', required: true },
  page: { 
    type: 'string', 
    required: true,
    validator: (rule, value) => Number(value) > 0,
    message: 'page 需传入正整数'
  },
  pageSize: { 
    type: 'string', 
    required: true,
    validator: (rule, value) => Number(value) > 0,
    message: 'pageSize 需传入正整数'
  },
}), async (ctx, next) => {
  const options = {
    url: 'https://short-msg-ms.juejin.im/v1/topicList/followed',
    method: "GET",
    params: {
      device_id: config.deviceId,
      src: 'web',
      token: config.token,
      uid: config.uid,
      after: ctx.query.after,
      page: ctx.query.page - 1,
      pageSize: ctx.query.pageSize
    }
  };
  let { body } = await request(options)
  ctx.body = body
})

// 关注话题逻辑共有
function followTopics(ctx){
  let action = ctx.method === 'put' ? 'follow' : 'unfollow'
  const options = {
    url: 'https://short-msg-ms.juejin.im/v1/topic/'+action,
    method: 'POST',
    body: {
      device_id: config.deviceId,
      src: 'web',
      token: config.token,
      uid: config.uid,
      topicId: ctx.request.body.topicId
    }
  };
  return request(options)
}

/**
 * 关注话题
 * @param {string} topicId 
 */
router.put('/follow', validator({
  topicId: { type: 'string', required: true }
}), async (ctx, next) => {
  let { body } = await followTopics(ctx)
  ctx.body = body
})

/**
 * 取消关注话题
 * @param {string} topicId 
 */
router.delete('/follow', validator({
  topicId: { type: 'string', required: true }
}), async (ctx, next) => {
  let { body } = await followTopics(ctx)
  ctx.body = body
})



module.exports = router