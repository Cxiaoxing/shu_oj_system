<template>
  <el-row :gutter="15" style="margin-bottom: 20px">
    <el-col :span="4.5">
      <el-select v-model="tag_filter" multiple placeholder="筛选标签(多选)">
        <el-option
          v-for="item in tagOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="4.5">
      <el-select v-model="difficulty_filter" clearable placeholder="筛选难度">
        <el-option
          v-for="(item, index) in difficultyOptions"
          :key="index"
          :label="item"
          :value="item"
        >
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="9">
      <el-input
        placeholder="请输入想要搜索的题目名称"
        v-model="title_filter"
        @keyup.enter.native="
          searchProblemList(title_filter, tag_filter, difficulty_filter)
        "
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="
            searchProblemList(title_filter, tag_filter, difficulty_filter)
          "
        ></el-button>
      </el-input>
    </el-col>
  </el-row>
</template>

<script>
import { tagListRequest } from "@/request/tagRequest";

export default {
  props: {
    searchProblemList: {
      type: Function,
    },
  },
  data() {
    return {
      tagOptions: [],
      difficultyOptions: ["Navie", "Easy", "Middle", "Hard"],
      title_filter: "",
      tag_filter: [],
      difficulty_filter: "",
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
  },
};
</script>