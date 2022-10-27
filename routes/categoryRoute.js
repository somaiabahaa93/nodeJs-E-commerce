const express=require("express")
const router=express.Router()
const { param, validationResult } = require('express-validator');
const {getCategoryValidator,createCategoryValidator,updateCategoryValidator,deleteCategoryValidator}=require("../utils/validators/categoryValidator")

const {
    getCategories
    ,createCategory
    ,getCategory,
     updateCategory,
    deleteCategory}=require("../services/categoryService")
router.get("/",getCategories)
router.route("/").get(getCategories).post(createCategoryValidator,createCategory)
router.route("/:id")
.get(
getCategoryValidator,
getCategory)
.put(updateCategoryValidator,updateCategory)
.delete(deleteCategoryValidator,deleteCategory)

module.exports=router
