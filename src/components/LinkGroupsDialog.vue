<template>
  <div>
    <el-dialog
      title="可参加该小组赛的小组名单"
      :visible="linkGroupsDialogVisible"
      width="40%"
      @open="getGroupList()"
      @close="closeGroupDialog()"
    >
      <el-button type="primary" plain @click="showAddGroupsDialog()"
        >添加小组</el-button
      >
      <el-table :data="groupList">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="小组标题" />
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button
              type="danger"
              size="small"
              @click="deleteGroup(scope.row.id, scope.row.title)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog
      title="添加小组"
      :visible.sync="addLinkGroupsDialogVisible"
      width="30%"
      append-to-body
    >
      <el-input
        style="width: 400px; margin-bottom: 10px"
        size="medium"
        placeholder="请输入想要搜索的小组名称"
        v-model="searchInput"
        @keyup.enter.native="getAllGroupList()"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="getAllGroupList()"
        ></el-button>
      </el-input>
      <el-table :data="allGroupList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="id" label="ID" width="80"> </el-table-column>
        <el-table-column prop="title" label="小组标题"> </el-table-column>
      </el-table>
      <el-pagination
        background
        hide-on-single-page
        @current-change="getAllGroupList"
        :page-size="pageSize"
        :current-page="currentPage"
        layout="prev, pager, next, jumper"
        :total="total"
        class="table_pagination"
      >
      </el-pagination>
      <div class="buttonWrap">
        <el-button type="primary" @click="addGroupRequest()">添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  contestLinkGroupListRequest,
  contestDeleteLinkGroupRequest,
  contestAddLinkGroupRequest,
} from "@/request/contestRequest";
import { groupListRequest } from "@/request/groupRequest";
export default {
  props: {
    region: {
      type: String,
      default: "",
    },
    linkGroupsDialogVisible: {
      type: Boolean,
      default: false,
    },
    closeDialog: {
      type: Function,
    },
  },
  data() {
    return {
      groupList: [],

      // 添加小组
      addLinkGroupsDialogVisible: false,
      searchInput: "",
      allGroupList: [],
      currentPage: 1,
      pageSize: 5,
      total: null,
      multipleSelection: [],
      group_ids: [],
    };
  },

  methods: {
    getGroupList() {
      contestLinkGroupListRequest(this.region)
        .then((response) => {
          this.groupList = response;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    deleteGroup(id, title) {
      this.$confirm(
        "此操作将从该小组赛名单中删除小组 【" + title + "】 , 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          contestDeleteLinkGroupRequest(this.region, id)
            .then(() => {
              this.getGroupList();
              this.$message.success("删除成功");
            })
            .catch(() => {
              this.$message.warning("删除失败");
            });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },

    // 添加小组
    showAddGroupsDialog() {
      this.getAllGroupList();
      this.addLinkGroupsDialogVisible = true;
    },
    getAllGroupList(currentPage = 1) {
      const params = {
        title_filter: this.searchInput,
        limit: this.pageSize,
        offset: this.pageSize * (currentPage - 1),
      };
      groupListRequest(params)
        .then((response) => {
          this.currentPage = currentPage;
          this.allGroupList = response.list;
          this.total = response.total;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.group_ids = val.map((item) => item.id);
    },
    addGroupRequest() {
      const data = {
        group_ids: this.group_ids,
      };
      contestAddLinkGroupRequest(this.region, data)
        .then(() => {
          this.$message.success("添加小组成功");
          this.addLinkGroupsDialogVisible = false;
        })
        .catch(() => {
          this.$message.warning("添加小组失败");
        });
    },

    closeGroupDialog(){
      this.closeDialog();
      this.groupList = []
    }
  },
};
</script>

<style>
</style>