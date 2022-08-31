import request from '@/utils/request';
//获取SPU列表数据的接口 //damin.product/{page}/{limit} get page limit category3Id
export const reqSpuList=(page,limit,category3Id)=>request({url:`/admin/product/${page}/${limit}`,method: 'GET',params:{category3Id}})
