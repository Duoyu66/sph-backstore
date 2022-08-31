<template>
  <div>
    <el-card style="margin: 20px 0">
      <categorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></categorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addAttr">添加属性
        </el-button>
        <!--      表格展示平台属性-->
        <el-table style="width: 100%;" border :data="attrList">
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center">
          </el-table-column>
          <el-table-column
            prop="attrName"
            label="属性名称"
            width="150px">
          </el-table-column>
          <el-table-column
            prop="prop"
            label="属性值列表"
            width="width">
            <template slot-scope="{row,$index}">
              <el-tag type="success" v-for="(attrValue,index) in  row.attrValueList" :key="attrValue.id"
                      style="margin: 0 20px;">{{ attrValue.valueName }}
              </el-tag>
            </template>

          </el-table-column>
          <el-table-column
            prop="prop"
            label="操作"
            width="150px">
            <template slot-scope="{row,$index}">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>

      </div>
      <!--    修改属性-->
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled="!attrInfo.attrName">添加属性名
        </el-button>
        <el-button type="info" @click="isShowTable=true">取消</el-button>
        <el-table style="width: 100%;margin: 20px 0" border :data="attrInfo.attrValueList">
          <el-table-column align="center" type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{row,$index}">
              <el-input v-model="row.valueName" placeholder="请输入属性值名称" size="mini" v-if="row.flag" @blur="toLook(row)"
                        @keyup.native.enter="toLook(row)"></el-input>
              <span v-else @click="toEdit(row)">{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">

              <!--              删除提示框-->
              <el-popconfirm :title="`确定删除${row.valueName}?`" @onConfirm="deleteAttrValue">
                <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference">我擦</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="addOrUpdateAttr" :disabled="attrInfo.attrValueList.length<1">保存啊</el-button>
        <el-button type="info" @click="isShowTable=true">取消</el-button>
      </div>
    </el-card>

  </div>
</template>

<script>
//按需引入lodash中的深拷贝
import cloneDeep from 'lodash/cloneDeep'

export default {
  name: "Attr",
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      //接收服务器平台属性的字段
      attrList: [],
      isShowTable: true,
      flag: true,
      //收集新增属性|修改属性使用的
      attrInfo: {
        attrName: "", //属性名
        attrValueList: [
          //属性值，因为属性值可以有多个因此用数组，每一个属性值都是一个对象需要attrId，valueName

        ],
        categoryId: 0, //三级分类的id
        categoryLevel: 3, //因为服务器也需要区分几级id
      },
    }
  },
  mounted() {

  },

  methods: {
    //自定义事件的回调
    getCategoryId({categoryId, level}) {
      console.log(categoryId)
      if (level == 1) {
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
      } else if (level == 2) {
        this.category2Id = categoryId
        this.category3Id = ''
      } else {
        this.category3Id = categoryId
        this.getAttrList()
      }
    },
    //获取平台属性的数据
    //当用户确定三级分类的数据时候，可以向服务器发请求获取平台属性进行展示
    async getAttrList() {
      //获取分类的ID
      const {category1Id, category2Id, category3Id} = this
      let result = await this.$API.attr.reqAttrList(category1Id, category2Id, category3Id)
      if (result.code == 200) {
        this.attrList = result.data
      }
    },
    //添加属性值回调
    addAttrValue() {
      //向属性值的数组里面添加元素
      //attrId：是你相应的属性的id，目前而言我们是添加属性的操作，还没有相应的属性的id，目前而言带给服务器的id为undefined
      //valueName:相应的属性值的名称
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id, //对于修改某一个属性的时候，可以在已有的属性值基础之上新增新的属性值（新增属性值的时候，需要把已有的属性的id带上）
        valueName: "",
        flag: true,
      });
      //flag属性：给每一个属性值添加一个标记flag，用户切换查看模式与编辑模式，好处，每一个属性值可以控制自己的模式切换
      //当前flag属性，响应式数据（数据变化视图跟着变化）
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    //添加属性按钮的回调
    addAttr() {
      //切换table显示和隐藏
      this.isShowTable = false
      this.attrInfo = {
        attrName: "", //属性名
        attrValueList: [
          //属性值，因为属性值可以有多个因此用数组，每一个属性值都是一个对象需要attrId，valueName

        ],
        categoryId: 0, //三级分类的id
        categoryLevel: 3, //因为服务器也需要区分几级id
      }
    },
    //修改某一属性
    updateAttr(row) {
      this.isShowTable = false
      this.attrInfo = cloneDeep(row)
      this.attrInfo.attrValueList.forEach(item => {
        this.$set(item, 'flag', false)
      })
    },
    //失去焦点的事件
    toLook(row) {
      row.flag = false
    },
    //点击视频span的回调
    toEdit(row) {
      row.flag = true
      //获取input节点，实现自动对焦
      //需要注意：点击span的时候，切换为input为编辑模式，但是需要注意，对于浏览器而言，页面重绘与重拍耗时间
      //点击span的时候，重绘重拍一个input它是耗费事件，因此我们不可能一点击span立刻获取到input
      //$nextTick，当节点渲染完毕，会执行一次
      this.$nextTick(() => {
        //获取相应的input扁担元素实现聚焦
        this.$refs[index].focus();
      })

    },
    //气泡确认框确当按钮的回调
    deleteAttrValue(index) {
      //当前删除属性值是不需要发请求
      this.attrInfo.attrValueList.splice(index, 1)
    },
    //保存按钮进行添加属性修i该属性的操作
    async addOrUpdateAttr() {
      //整理参数，如果用户添加了很多属性值，且属性值为空的不因该提交给服务器
      //提交给服务器数据中不应该出现flag字段
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
        //过滤掉属性值不为空的
        if (item.valueName != '') {
          //删除掉flag属性
          delete item.flag;
          return true
        }
      })
      try {
        //发请求
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
        //展示平台属性的信号量进行切换
        this.isShowTable=false
        //提示消息
        this.$message({type: 'success', message: '保存成功!'})
     await   this.getAttrList()
      } catch (e) {
        console.log(e.message)
      }
    }

  }
}
</script>

<style scoped></style>
