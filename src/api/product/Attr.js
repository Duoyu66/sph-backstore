//平台属性管理模块请求文件
import request from '@/utils/request'

//获取一级分类接口
///admin/product/getCategory1 get
export const reqCategory1List=()=>request({url:'/admin/product/getCategory1',method:'GET'})

//获取二类数据接口
///admin/product/getCategory2/{categoryId} get
export const reqCategory2List = (category1Id)=>request({url:`/admin/product/getCategory2/${category1Id}`,method:'GET'})

//获取三级分类数据接口   //admin/product/getCategory3/{category2Id} get
export const reqCategory3List = (category2Id)=>request({url:`/admin/product/getCategory3/${category2Id}`,method:'get'})

//获取商品基础数据的接口   /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqAttrList=(category1Id, category2Id, category3Id)=>request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'})

//添加属性和属性接口 /admin/product/saveAttrInfo
export const reqAddOrUpdateAttr=(data)=>request({url:'/admin/product/saveAttrInfo',method:'POST',data})
