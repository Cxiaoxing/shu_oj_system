<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>题目管理</el-breadcrumb-item>
      <el-breadcrumb-item>标签列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <div class="createTagButton">
        <el-button type="primary" plain @click="createTag()"
          >新建标签</el-button
        >
        <el-button type="primary" plain @click="applyTag()">应用标签</el-button>
      </div>
      <el-table :data="tagOptions">
        <el-table-column prop="id" label="ID" width="80"> </el-table-column>
        <el-table-column prop="name" label="标签名"> </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              @click="showEditTagMessageBox(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click="deleteTag(scope.row.id, scope.row.name)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import {
  tagCreateRequest,
  tagListRequest,
  tagEditRequest,
  tagDeleteRequest,
  tagApplyRequest,
} from "@/request/tagRequest";
export default {
  data() {
    return {
      tagOptions: [],
    };
  },
  created() {
    this.getTagList();
  },
  methods: {
    getTagList() {
      tagListRequest()
        .then((response) => {
          this.tagOptions = response.list;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    // 新建标签
    createTag() {
      this.$prompt("", "请输入标签名", {
        confirmButtonText: "新建",
        cancelButtonText: "取消",
      })
        .then(({ value: tagName }) => {
          const data = { name: tagName };
          tagCreateRequest(data)
            .then(() => {
              this.getTagList();
              this.$message({
                type: "success",
                message: "新建标签成功，请点击应用标签...",
              });
            })
            .catch(() => {
              this.$message({
                type: "warning",
                message: "新建标签失败",
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消新建",
          });
        });
    },
    // 标签应用生效
    applyTag() {
      tagApplyRequest()
        .then(() => {
          this.$message({
            message: "标签应用生效",
            type: "success",
          });
        })
        .catch(() => {
          this.$message({
            message: "标签应用未生效，请再次尝试...",
            type: "warning",
          });
        });
    },
    // 修改标签弹框
    showEditTagMessageBox(id) {
      this.$prompt("", "请输入新标签名", {
        confirmButtonText: "更新",
        cancelButtonText: "取消",
      })
        .then(({ value: tagName }) => {
          const data = { new_name: tagName };
          tagEditRequest(id, data)
            .then(() => {
              this.getTagList();
              this.$message({
                type: "success",
                message: "修改标签信息成功，请点击应用标签...",
              });
            })
            .catch(() => {
              this.$message({
                type: "warning",
                message: "修改标签信息失败",
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消修改",
          });
        });
    },
    // 删除标签
    deleteTag(id, tagName) {
      this.$confirm(
        "此操作将永久删除标签 【" +
          tagName +
          "】 , 已和题目进行关联的标签不能进行删除, 是否继续?",
        "提示",
        {
          confirmButtonText: "删除",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          tagDeleteRequest(id)
            .then(() => {
              this.getTagList();
              this.$message({
                message: "标签删除成功，请点击应用标签...",
                type: "success",
              });
            })
            .catch(() => {
              this.$message({
                message: "标签删除失败",
                type: "warning",
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style lang="scss">
.createTagButton {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}
</style>