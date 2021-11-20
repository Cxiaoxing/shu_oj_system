<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>题库管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/problemManage/list' }"
        >题目列表</el-breadcrumb-item
      >
      <el-breadcrumb-item>{{ problemtitle }}</el-breadcrumb-item>
      <el-breadcrumb-item>管理标程</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域，展示题目列表 -->
    <el-card>
      <div>
        <!-- 搜索区域与添加区域 -->
        <div>
          <el-row>
            <el-col :span="8">
              <el-input size="medium" placeholder="请输入内容">
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </el-col>
          </el-row>
        </div>
        <!-- 列表区域 -->
        <div>
          <el-table :data="sampleList" style="margin-top: 20px">
            <el-table-column prop="submit_time" label="提交时间">
            </el-table-column>
            <el-table-column label="判题状态">
              <template slot-scope="scope">
                <el-tag
                  :type="
                    scope.row.submission_state == 'Finished'
                      ? 'success'
                      : scope.row.submission_state == 'Pending'
                      ? ''
                      : scope.row.submission_state == 'Wainting'
                      ? 'info'
                      : ''
                  "
                  size="small"
                >
                  {{ scope.row.submission_state }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column label="判题结果">
              <template slot-scope="scope">
                <el-tag
                  v-if="scope.row.submission_state === 'Finished'"
                  effect="dark"
                  :type="
                    scope.row.err !== null
                      ? 'warning'
                      : scope.row.err === null && scope.row.is_accepted == true
                      ? 'success'
                      : scope.row.err === null && scope.row.is_accepted == false
                      ? 'danger'
                      : 'success'
                  "
                  size="small"
                >
                  {{
                    resultFormtype(scope.row.err, scope.row.is_accepted)
                  }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column prop="language" label="语言"></el-table-column>
            <el-table-column label="操作">
              <!-- 查看标程详情按钮 -->
              <template slot-scope="scope">
                <el-button
                  size="small"
                  @click="handleClickProblem(scope.row.submission_id)"
                  >查看</el-button
                >
                <el-button
                  type="danger"
                  size="small"
                  @click="deleteSample(scope.row.submission_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { problemInfoPrivateRequest } from "@/request/problemRequest";
import {
  sampleListRequest,
  sampleDeleteRequest,
} from "@/request/sampleRequest";
export default {
  data() {
    return {
      id: "", //接受前一个页面传来的 problemid
      problemtitle: "",
      // 查询到的用户列表
      sampleList: [],
    };
  },
  created() {
    this.id = this.$route.params.id;
    this.getProblem(this.id);
    this.getSampleList(this.id);
  },
  methods: {
    // 获取题目信息
    getProblem: function (region) {
      const that = this;
      problemInfoPrivateRequest(region)
        .then(function (response) {
          that.problemtitle = response.info.title;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    // 获取标程列表
    getSampleList: function (id) {
      const that = this;
      const params = { problem_id_filter: id, limit: 100, offset: 0 };
      sampleListRequest(params)
        .then(function (response) {
          that.sampleList = response.list;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    // 判断判题结果，返回对应文字
    resultFormtype(err, is_accepted) {
      if (err != null) {
        return "Compile Error";
      } else {
        if (is_accepted == true) {
          return "Accepted";
        } else {
          return "Unaccepted";
        }
      }
    },

    // 删除标程
    deleteSample: function (uuid) {
      this.$confirm("此操作将永久删除该标程, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const that = this;
          sampleDeleteRequest(uuid)
            .then(function (response) {
              //重新获取标程列表
              that.getSampleList(that.id);
              // 提示用户删除成功
              that.$message({
                message: "标程删除成功",
                type: "success",
              });
            })
            .catch(function (error) {
              that.$message({
                message: "标程删除失败",
                type: "warning",
              });
              console.log(error);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 点击题目跳转至提交结果详情
    handleClickProblem: function (id) {
      let uuid = id;
      const that = this;
      that.$router.push({ name: "sampleResultDetail", params: { uuid: uuid } });
    },
  },
};
</script>

<style lang='scss' scoped>
.editpic {
  width: 25px;
}
</style>
