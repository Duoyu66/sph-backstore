<template>
  <div>
    <el-card style="margin: 20px 0">
      <!--      三级联动已经是全局组件了-->
      <categorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></categorySelect>
    </el-card>

    <el-card>
      <div>
        <!--      展示SPU列表的结构-->
        <el-button type="primary" icon="el-icon-plus">添加SPU</el-button>
        <el-table style="width: 100%" border :data="records">
          <el-table-column type="index" label="序号" width="80px">
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <!--            这里的按钮将来用hintButton替换-->
              <hint-button type="success" icon="el-icon-plus" size="mini" title="添加spu"></hint-button>
              <hint-button type="warning" icon="el-icon-plus" size="mini" title="修改spu" @click="updateSpu(row)"></hint-button>
              <hint-button type="info" icon="el-icon-plus" size="mini" title="查看当前spu全部"></hint-button>
              <hint-button type="danger" icon="el-icon-delete" size="mini" title="删除spu"></hint-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="text-align: center"
          :current-page="page"
          :page-sizes="[3,5,10]"
          :page-size="limit"
          layout="prev,pager,next,jumper,->,sizes,total"
          :total="total">

        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Spu",
  data() {
    return {
      //分别是分类的ID
      category1Id: '',
      category2Id: '',
      category3Id: '',
      page: 1,
      //控制三级联动的可操作性
      show: true,
      isShowTable: true,
      total: 0,
      records: [],
      limit: 3,
    }
  },
  methods: {
    //点击分页器的第几页的回调
    handleCurrentChange(page) {
    this.pade=page
      this.getSpuList()
    },
    //三级联动的自定义事件，可以把子组件相应的id传递给父组件
    getCategoryId({categoryId, level}) {
      if (level == 1) {
        this.category1Id = categoryId;
        //清除2，3类的id
        this.category2Id = ''
        this.category3Id = ''
      } else if (level == 2) {
        this.category2Id = categoryId
        this.category3Id = ''
      } else {
        this.category3Id = categoryId
        //获取SPU列表数据进行展示
        this.getSpuList()
      }
    },
    //获取SPU列表数据的方法
    async getSpuList() {
      const {page, limit, category3Id} = this
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id)
      if (result.code == 200) {
        this.total = result.data.total
        this.records = result.data.records
      }
    },
    //修改spu
    updateSpu(row){
      alert(23)
    }

  }
}
</script>

<style scoped>

</style>
