<template>
  <div>
    <!--  inline-->
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <el-select placeholder="请选择" value="" v-model="cForm.category1Id" @change="handler1" :disabled="show">
          <el-option v-for="(c1,index) in list1" :key="c1.id" :label="c1.name" :value="c1.id" ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select placeholder="请选择" v-model="cForm.category2Id" @change="handler2" :disabled="show">
          <el-option :label="c2.name" :value="c2.id" v-for="(c2,index) in list2" :key="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select placeholder="请选择" v-model="cForm.category3Id" @change="handler3" :disabled="show">
          <el-option :label="c3.name" :value="c3.id" v-for="(c3,index) in list3" :key="c3.id"> </el-option>

        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props:['show'],
  data() {
    return {
      //各级分类的数据
      list1: [],
      list2:[],
      list3:[],
      cForm:{
        category1Id:'',
        category2Id:'',
        category3Id:''
      }
    }
  },
  //其他组件调用的时候的标签
  name: "CategorySelect",
  mounted() {
    this.getCategory1List()
  },
  methods: {
    //获取一级分类数据的方法,不需要携带参数
    async getCategory1List() {
      let result = await this.$API.attr.reqCategory1List()
      if (result.code == 200) {
        this.list1 = result.data
      }
    },
    //一级分类select事件回调（当一级分类的option发生变化的时候获取相应二级分类的数据）
    async  handler1(){
      this.list2 =[]
      this.list3 =[]
      this.cForm.category2Id=''
      this.cForm.category3Id=''

      //解构出一级分类的id
      const {category1Id} =this.cForm
      this.$emit('getCategoryId',{categoryId:category1Id,level:1})
      let result=await this.$API.attr.reqCategory2List(category1Id)
     if(result.code == 200) {
       this.list2 = result.data
     }
    },
    //二给三
    async handler2(){
      this.list3 =[]
      this.cForm.category3Id=''

      //解构出二级分类的id
      const {category2Id} =this.cForm
      this.$emit('getCategoryId',{categoryId:category2Id,level:2})
      let result = await this.$API.attr.reqCategory3List(category2Id)
      if(result.code==200){
        this.list3=result.data
      }
    },
    //三级分类给别的
    handler3(){
      const {category3Id} =this.cForm
      this.$emit('getCategoryId',{categoryId:category3Id,level:3})

    }
  }
}
</script>

<style scoped>

</style>
