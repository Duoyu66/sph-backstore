<template>
  <div>
    <!--  按钮-->

    <el-button type="primary" icon="el-icon-plus" style="margin: 10px 0" @click="showDialog">添加</el-button>
    <!--  表格组件
          将来展示的数据---数据类型
    -->
    <el-table style="width: 100%;" :data="list">
      <el-table-column type="index" label="序号" width="80px" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
        <template slot-scope="{row,$index}">
          <img :src="row.logoUrl" alt="" style="width: 100px;height: 100px;">
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{row,$index}">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTradeMark(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTradeMark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页器-->
    <el-pagination
      style="margin-top:20px;
    text-align: center"
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[3,5,10]"
      layout="prev,pager,next,jumper,->,total,sizes"
      @current-change="getPageList"
      @size-change="handleSizeChange">
    </el-pagination>
    <!--对话框-->
    <el-dialog :title="tmForm.id?'修改品牌':'添加品牌'" :visible.sync="dialogFormVisible">
      <!--      form表单          :model属性,这个属性的作用是把表单收集到那个对象的身上，将来表单验证，也需要这个属性-->
      <el-form style="width: 80%;" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrupdateTradeMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    var validateTmName=(rule,value,callback) =>{
      if (value.length<2||value.length>10){
        callback(new Error("invalid 品牌"))
      }else{
        callback();
      }
      };
    return {
      //代表的分页器第几页
      page: 1,
      //当前页数展示数据条数
      limit: 3,
      //总共数据条数
      total: 0,
      //列表展示的数据
      list: [],
      //对话框显示和隐藏控制的属性
      dialogFormVisible: false,
      //上传图片使用的属性
      imgUrl: '',
      tmForm: {
        tmName: "",
        logoUrl: "",

      },
      rules: {
        //品牌名称的验证规则
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' },
        ],
        logoUrl: [
          { required: true, message: '请选择品牌图鉴' }
        ],
      }
    }

  },

  methods: {
    //获取列表数据
    async getPageList(pager=1) {
      this.page=pager
      // 解构出参数
      const {page, limit} = this

      //获取品牌列表的接口
      let result = await this.$API.trademark.reqTradeMarkList(page, limit);
      if (result.code == 200) {
        //分别是展示数据的总条数和列表
        this.total = result.data.total;
        this.list = result.data.records;

      }
    },
    //当分页器某一页需要展示数据条数发生变化的时候会触发
    handleSizeChange(limit) {
      //整理参数
      this.limit = limit
      this.getPageList();
    },
    showDialog() {
      this.dialogFormVisible = true;
    },
    //修改某一品牌
    updateTradeMark(row) {
      //row:当前用户选中这个品牌信息
      //显示对话框
      this.dialogFormVisible = true
      this.tmForm = {...row}
    }

    ,
    //图片上传成功
    handleAvatarSuccess(res, file) {
      //res：上传成功之后返回前端数据
      //file:上传成功之后服务器返回前端数据
      //收集品牌图片数据，因为将来需要带给服务器
      this.tmForm.logoUrl = res.data;
    },
    //图片上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //添加按钮(修改按钮)
     addOrupdateTradeMark(){
      //当表单全部通过再去书写业务逻辑
      this.$refs.ruleForm.validate(async (success)=>{
        this.dialogFormVisible=false;
        //发请求
        let result =await this.$API.trademark.reqAddOrUpdateTradeMark(
          this.tmForm
        );
        if (result.code==200){
          //弹出信息：添加品牌成功、修改品牌成功
          this.$message({
            type:"success",
            message:this.tmForm.id?"修改品牌成功":"添加品牌成功"
          });
          this.getPageList(this.tmForm.id?this.page:1)
        }else{
          console.log("error submit!")
          return false;
        }
      })
    },
    //删除品牌的操作
    deleteTradeMark(row){
      console.log(row)
      this.$confirm(`你确定删除${row.tmName}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        //当用户点击确定按钮的时候会触发
        //向服务器发请求
        let result =await   this.$API.trademark.reqDeleteTradeMark(row.id)
       if (result.code == 200){
         this.$message({
           type: 'success',
           message: '删除成功!',
         });
       }
        this.getPageList()

      }).catch(() => {
        //点击取消的时候会触发
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  },
  mounted() {
    this.getPageList()
  }


}
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed black;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
