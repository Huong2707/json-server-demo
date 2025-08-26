const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults();
const queryString = require('query-string');


// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)

// Add custom routes before JSON Server router
server.get('/echo', (req, res) => {
  res.jsonp(req.query)
})

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
    console.log('Method:', req.method)
  console.log('URL:', req.url)
  console.log('Body:', req.body)
  
  if (req.method === 'POST') {
    req.body.createdAt = Date.now();
    req.body.updatedAt = Date.now();
  }else if(req.method === 'PATCH'){
    req.body.updatedAt = Date.now();
  }
  // Continue to JSON Server router
  next()
});
// In this example, returned resources will be wrapped in a body property
router.render = (req, res) => {
  const header=res.getHeaders();
  const totalCount=header['x-total-count'];
  if(req.method === 'GET' && totalCount ){
    // const queryParams=queryString.parse(req._parseUrl.query);
    const queryParams = queryString.default.parse(req.url.split('?')[1] || '');


    console.log(queryParams);


    const result ={
      data:res.locals.data,
      pagination:{
        _page: Number.parseInt(queryParams._page) || 1,
        _limit: Number.parseInt(queryParams._limit) || 10,
        _totalRows: Number.parseInt(totalCount),
      },
    };

    return res.jsonp(result);
  }
  
  res.jsonp(res.locals.data);

}

// Use default router
server.use('/api',router)
server.listen(3000, () => {
  console.log('JSON Server is running')
})