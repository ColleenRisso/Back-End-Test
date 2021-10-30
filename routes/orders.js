const Router = require("koa-router")
const uuid = require("uuid").v4

const ordersRouter = new Router({ prefix: "/orders" })
const ordersData = require("../data/ordersData")

ordersRouter.post("/", async (ctx) => {
  const { customerName, items } = ctx.request.body

  if (!items.length) {
    ctx.throw(409, "No items ordered")
  }

  const total = items.reduce(
    (orderTotal, item) => (orderTotal += item.price),
    0
  )
  const order = {
    id: uuid(),
    customerName,
    createdOn: new Date(),
    items,
    total,
  }

  ctx.status = 201
  ctx.body = [...ordersData, order]
})

ordersRouter.get("/", async (ctx) => {
  const { filterProperty, filterValue } = ctx.query

  let results = ordersData

  if (filterProperty && filterValue) {
    const filteredResults = ordersData.filter(({ items }) =>
      items.some(({ name }) => name.includes(filterValue))
    )
    results = filteredResults
  }

  ctx.status = 200
  ctx.body = results
})

ordersRouter.get("/:id", async (ctx) => {
  const { id } = ctx.params
  const order = ordersData.find((order) => order.id === id)

  if (!order) {
    ctx.throw(404, "Order not found")
  }

  ctx.status = 200
  ctx.body = order
})

ordersRouter.put("/:id", async (ctx) => {
  const { id } = ctx.params
  const { customerName, items } = ctx.request.body

  let order = ordersData.find((order) => order.id === id)

  if (!order) {
    ctx.throw(404, "Could not find order")
  }

  if (!items) {
    ctx.throw(409, "No items ordered")
  } else {
    order["items"] = items
  }
  console.log(order)
  const updated = {
    ...order,
    //customerName,
    //items,
  }

  ctx.status = 200
  ctx.body = updated
})

ordersRouter.delete("/:id", async (ctx) => {
  const { id } = ctx.params

  const order = ordersData.find((order) => order.id === id)

  if (!order) {
    ctx.throw(404, "Could not find order")
  }

  const remaining = ordersData.filter((order) => order.id !== id)

  ctx.status = 200
  ctx.body = remaining
})

module.exports = ordersRouter
