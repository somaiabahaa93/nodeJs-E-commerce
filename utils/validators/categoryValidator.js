const { check } = require('express-validator');
const validatorMiddleware=require("../../middelwares/validatorMiddleware")

exports.getCategoryValidator=[
    check('id').isMongoId().withMessage("this is invalid id format"),
    validatorMiddleware
]

exports.createCategoryValidator=[
    check('name').notEmpty().withMessage("category is required").
    isLength({min:2}).withMessage("min length is 2").isLength({max:32}).withMessage("max length is 32 char"),
    validatorMiddleware
]

exports.updateCategoryValidator=[
    check('id').isMongoId().withMessage("this is invalid id format"),
    validatorMiddleware
]

exports.deleteCategoryValidator=[
    check('id').isMongoId().withMessage("this is invalid id format"),
    validatorMiddleware
]