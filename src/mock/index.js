// index.js
module.exports = () => {
  const data = { news: [] }
  let imgList = [
    'http://test-1252042681.cossh.myqcloud.com/detail/信任.jpg',
    'http://test-1252042681.cossh.myqcloud.com/detail/分享.jpg',
    'http://test-1252042681.cossh.myqcloud.com/detail/初心.jpg'
  ]
  // Create 1000 users
  for (let i = 0; i < 30; i++) {
    data.news.push({ id: i, title: `新闻标题${i}`, author: '作者', coverURL: imgList[i % 3], dateOfCreated: '2018-04-22' })
  }
  return data
}