<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/practice' }">题集</el-breadcrumb-item>
      <el-breadcrumb-item>{{ test }}</el-breadcrumb-item>
    </el-breadcrumb>
    <ProblemDetail :id="id"/>
  </div>  
</template>

<script>
import ProblemDetail from '../components/ProblemDetail.vue'
export default {
  data() {
    return {
      id: 0, //接受前一个页面传来的id值
    };
  },
  created() {
    this.id = this.$route.params.id;
  },
  methods: {
    
  },
  components: {
    ProblemDetail,
  },
};
</script>

<style lang="scss" >
.cardLayout {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.rightcard {
  width: 50%;
}
.leftcard {
  width: 48%;
}
.problemTitle {
  font-size: 30px;
  font-weight: 400;
  color: #404040;
}

.sample {
  margin-top: 20px;
  padding: 8px 25px 15px 25px;
  background-color: $background_color;
  border-radius: 4px;
}
.sampleDisplay {
  margin-top: 16px;
  margin-bottom: 24px;
  margin-left: 20px;
  display: flex;
  flex-direction: column;
}

.sampleDetail {
  display: flex;
  flex-direction: column;
  margin-top: 24px;
}

.sampleTitle {
  font-size: 24px;
  font-weight: 600;
  line-height: 1.25;
  padding-bottom: 0.3em;
  font-size: 1.5em;
  border-bottom: 1px solid #eaecef;
}

.sampleDetailWord {
  font-size: 16px;
  margin-top: 0px;
  margin-bottom: 5px;
  line-height: 1.5;
}

.CodeMirror {
  height: 380px;
}

.CodeMirror-scroll {
  height: 100%;
  overflow-y: hidden;
  overflow-x: auto;
}
</style>