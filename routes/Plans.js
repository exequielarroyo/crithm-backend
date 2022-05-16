const router = require("express").Router();
const expressAsyncHandler = require("express-async-handler");
const { validateToken } = require("../middlewares/Auth");
const { Plan } = require("../models");

router.get("/",  expressAsyncHandler(async(req,res)=>{
  const plans = await Plan.findAll();
  res.json(plans)
}));

router.post('/', expressAsyncHandler(async(req,res)=>{
  const plan = req.body;
  await Plan.create(plan)
  res.json('created')
}))

router.put('/', expressAsyncHandler(async(req,res)=>{
  const plan = req.body;
  const updatedPlan = await Plan.update(plan, { where: { name: plan.name } });
  res.json(updatedPlan);
}))

module.exports = router;
