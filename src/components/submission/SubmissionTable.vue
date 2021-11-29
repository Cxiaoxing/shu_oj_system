<template>
  <el-card>
    <div class="tableBar">
      <el-switch
        style="margin-right: 20px"
        v-model="switchValue"
        active-text="仅自己"
        inactive-text="全部"
        :active-value="user_id"
        :inactive-value="null"
        @change="getStateList()"
      ></el-switch>
      <el-button size="small" @click="getStateList()">刷新列表</el-button>
    </div>
    <!-- 列表区域 -->
    <el-table :data="statelist" @row-click="handleClickSubmission">
      <el-table-column prop="problem_id" label="题目ID" width="100">
      </el-table-column>
      <el-table-column prop="state" label="判题状态">
        <template slot-scope="scope">
          <el-tag
            :type="
              scope.row.state == 'Finished'
                ? 'success'
                : scope.row.state == 'Pending'
                ? ''
                : scope.row.state == 'Wainting'
                ? 'info'
                : ''
            "
            size="small"
          >
            {{ scope.row.state }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="判题结果">
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.state === 'Finished'"
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
            {{ resultFormtype(scope.row.err, scope.row.is_accepted) }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="用时">
        <template slot-scope="scope">
          {{ submissionTimeFormat(scope.row.max_time) }}
        </template>
      </el-table-column>
      <el-table-column label="内存"
        ><template slot-scope="scope">
          {{ submissionMemoryFormat(scope.row.max_memory) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="language"
        label="语言"
        width="100"
      ></el-table-column>
      <el-table-column prop="user_id" label="用户" width="100">
      </el-table-column>
      <el-table-column label="提交时间">
        <template slot-scope="scope">
          {{ formatTime(scope.row.submit_time) }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      hide-on-single-page
      @current-change="getStateList"
      :page-size="pageSize"
      :current-page="currentPage"
      layout="prev, pager, next, jumper"
      :total="total"
      class="table_pagination"
    >
    </el-pagination>
  </el-card>
</template>

<script>
import moment from "moment";
import { submissionListRequest } from "@/request/submissionRequest";
export default {
  props: {
    region: {
      type: String,
      default: "",
    },
    problem_filter: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      statelist: [],
      searchInput: "",
      currentPage: 1,
      pageSize: 10,
      total: null,
      switchValue: null,
      user_id: "",
    };
  },
  created() {
    this.getStateList();
    this.user_id = window.localStorage.getItem("id");
  },
  methods: {
    // 获取提交状态列表
    getStateList(currentPage = 1) {
      const params = {
        region_filter: this.region,
        problem_id_filter: this.problem_filter,
        user_id_filter: this.switchValue,
        limit: this.pageSize,
        offset: this.pageSize * (currentPage - 1),
      };
      submissionListRequest(params)
        .then((response) => {
          this.currentPage = currentPage;
          this.statelist = response.list;
          this.total = response.total;
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

    // 格式化展示时间
    formatTime(time) {
      return moment(time).format("YYYY-MM-DD HH:mm:ss");
    },
    // 友好展示提交耗时
    submissionTimeFormat(time) {
      if (time === null) {
        return "--";
      } else {
        return time + " ms";
      }
    },
    // 友好展示提交内存
    submissionMemoryFormat(memory) {
      if (memory === null) {
        return "--";
      } else {
        // 1048576 = 1024 * 1024
        let t = parseInt(memory) / 1048576;
        return String(t.toFixed(0)) + " MB";
      }
    },
    // 跳转至提交结果详情
    handleClickSubmission(row, column, event, cell) {
      this.$router.push({ name: "submissionDetail", params: { uuid: row.id } });
    },
  },
};
</script>
<style lang="scss" scoped>
.tableBar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 15px;
}
</style>